import userModel from "../models/userModel.js";
import messageModel from "../models/messageModel.js";
import { inGroup } from "./groupHandler.js";
import { formatSimpleUser } from "../routes/users.js";
import { getUser } from "../routes/users.js";
import { getUserId } from "../routes/users.js";
import e from "express";

function formatSimpleMessage(message) {
  return {
    _id: message._id.toString(),
    groupId: message.group._id.toString(),
    sender: formatSimpleUser(message.sender),
    content: message.content,
    attachment: message.attachment,
    mentions: message.mentions.map((user) => formatSimpleUser(user)),
    reactions: message.reactions.map((reaction) => ({
      reaction: reaction.reaction,
      users: reaction.users.map((user) => formatSimpleUser(user)),
    })),
    createdAt: message.createdAt,
    updatedAt: message.updatedAt,
  };
}

export default (io, socket) => {
  async function getMessages(payload, callback) {
    try {
      if (!(await inGroup(getUserId(socket.request), payload.groupId))) {
        throw new Error("you are not in this group");
      }
      const query = payload.curMessageId
        ? { _id: { $lt: payload.curMessageId }, group: payload.groupId }
        : { group: payload.groupId };

      const messages = await messageModel
        .find(query)
        .sort("-_id")
        .limit(payload.limit)
        .populate("sender")
        .populate({
          path: "parentMessage",
          populate: { path: "sender" },
        })
        .populate("mentions")
        .populate("reactions.users");
      const formattedMessages = messages.map((message) => {
        const parentMessage = message.parentMessage;
        const formattedMessage = formatSimpleMessage(message);
        if (parentMessage) {
          formattedMessage.parentMessage = formatSimpleMessage(parentMessage);
        }
        return formattedMessage;
      });
      callback({ messages: formattedMessages });
    } catch (err) {
      console.log(err.message);
      callback(err.message);
    }
  }

  async function readMessages(payload, callback) {
    try {
      const readMessage = await messageModel
        .findOne({ group: payload.groupId }, {}, { sort: { _id: -1 } })
        .populate("sender")
        .populate({
          path: "parentMessage",
          populate: { path: "sender" },
        })
        .populate("mentions");
      if (!message) {
        throw new Error("no messages group");
      }
      const formattedMessage = formatSimpleMessage(readMessage);
      const readBy = await userModel
        .findOneAndUpdate(
          { _id: getUserId(socket.request), "groups.group": payload.groupId },
          { $set: { "groups.$.lastReadMessage": message } },
          { new: true }
        )
        .populate("groups.group", "groups.lastReadMessage");
      if (!readBy) {
        throw new Error("user not found");
      }
      const formattedReadBy = formatSimpleUser(readBy);
      const emitPayload = {
        message: formattedMessage,
        readBy: formattedReadBy,
      };
      console.log("emitPayload", emitPayload);
      io.to(payload.groupId).emit("receiveReadMessages", emitPayload);
    } catch (err) {
      console.log(err.message);
      callback(err.message);
    }
  }

  async function sendMessage(payload, callback) {
    try {
      console.log("payload", payload);
      const senderId = getUserId(socket.request);
      if (!inGroup(senderId, payload.message.groupId)) {
        throw new Error("sendMessage error: must be in group to send message");
      }
      if (payload.message.mentions) {
        for (const mentionedUserId of payload.message.mentions) {
          const mentionedUserInGroup = await userModel.findOne({
            _id: mentionedUserId,
            groups: { $elemMatch: { group: payload.message.groupId } },
          });
          if (!mentionedUserInGroup) {
            throw new Error(
              `sendMessage error: mentioned user ${mentionedUserId} not in group`
            );
          }
        }
      }

      // parse input into mongoose query
      const messageQuery = {
        sender: senderId,
        group: payload.message.groupId,
        content: payload.message.content,
        reactions: [],
        ...payload.attachment,
        attachment: payload.message.attachment,
        ...payload.mentions,
        mentions: payload.message.mentions,
        ...payload.parentMessageId,
        parentMessage: payload.parentMessageId,
      };

      // create message in db and populate sender, parentMessage
      let messageDoc = await new messageModel(messageQuery).save();
      messageDoc = await messageDoc.populate("sender");
      if (messageDoc.parentMessage) {
        messageDoc = await messageDoc.populate("parentMessage");
      }
      // populate parentMessage's sender
      if (messageDoc.parentMessage) {
        messageDoc.parentMessage = await messageDoc.parentMessage.populate(
          "sender"
        );
      }
      if (messageDoc.mentions) {
        messageDoc.mentions = await messageDoc.populate("mentions");
      }
      // format
      const message = formatSimpleMessage(messageDoc);
      if (messageDoc.parentMessage) {
        message.parentMessage = formatSimpleMessage(messageDoc.parentMessage);
      }
      console.log("sendMessage success", message);
      io.to(message.groupId).emit("receiveMessage", message);
      callback({});
    } catch (err) {
      console.log(err.message);
      callback(err.message);
    }
  }

  async function editMessage(payload, callback) {
    try {
      const message = await messageModel
        .findOne({
          _id: payload.messageId,
          sender: getUserId(socket.request),
        })
        .populate("sender")
        .populate({
          path: "parentMessage",
          populate: { path: "sender" },
        })
        .populate("mentions");

      if (!message) {
        throw new Error("message not found");
      }
      const groupId = message.group;
      if (payload.mentions) {
        for (mentionedUserId of payload.mentions) {
          if (!inGroup(mentionedUserId, groupId)) {
            throw new Error(`mentioned user ${mentionedUserId} not in group`);
          }
        }
        message.mentions = payload.mentions;
      }
      message.content = payload.content;
      await message.save();

      const formattedMessage = formatSimpleMessage(message);
      io.to(groupId.toString()).emit("receiveMessageEdit", formattedMessage);

      callback({});
    } catch (err) {
      console.log(err.message);
      callback(err.message);
    }
  }

  async function reactToMessage(payload, callback) {
    try {
      const userId = getUserId(socket.request);
      const user = await userModel.findById(userId);
      if (!user) {
        throw new Error("user not found (sign in?)");
      }
      const userGroups = user.groups.map((group) => group.group.toString());
      const reactedToMessage = await messageModel
        .findOne({
          _id: payload.messageId,
          group: { $in: userGroups },
        })
        .populate("sender")
        .populate({
          path: "parentMessage",
          populate: { path: "sender" },
        })
        .populate({
          path: "reactions.users",
        });
      if (!reactedToMessage) {
        throw new Error("message not found");
      }
      // someone already reacted to this message with this reaction
      const existingReaction =
        reactedToMessage.reactions &&
        reactedToMessage.reactions.find(
          (reaction) => reaction.reaction === payload.reaction
        );
      console.log("reactions", reactedToMessage.reactions);
      if (existingReaction) {
        console.log("reaction exists");
        const userReacted = existingReaction.users.find(
          (user) => user._id.toString() === userId
        );
        // this user already reacted with this reaction -> remove user from reaction
        if (userReacted) {
          console.log("removing user from reaction");
          existingReaction.users.pull(userId);
          // now no users reacted with this reaction -> remove reaction from message
          if (existingReaction.users.length === 0) {
            console.log("removing reaction from message");
            reactedToMessage.reactions.pull(existingReaction);
          }
        }
        // this user has not reacted with this reaction -> add user to reaction
        else {
          console.log("adding user to reaction");
          existingReaction.users.push(userId);
        }
      }
      // no one has reacted to this message with this reaction
      else {
        console.log("adding reaction to message and user to reaction");
        // add reaction to message with user as reactor
        reactedToMessage.reactions.push({
          reaction: payload.reaction,
          users: [userId],
        });
      }
      await reactedToMessage.save();
      const formattedMessage = formatSimpleMessage(reactedToMessage);
      console.log("emitting to", reactedToMessage.group.toString());
      io.to(reactedToMessage.group.toString()).emit(
        "receiveMessageReact",
        formattedMessage
      );

      callback({});
    } catch (err) {
      console.log(err.message);
      callback(err.message);
    }
  }

  async function deleteMessage(payload, callback) {
    try {
      const deletedMessage = await messageModel.findOneAndDelete(
        { _id: payload.messageId, sender: getUserId(socket.request) },
        { content: payload.content }
      );
      // will respond with not found if message does not exist or belongs to another user
      if (!deletedMessage) {
        throw new Error("message not found");
      }

      io.to(deletedMessage.group.toString()).emit("receiveMessageDelete", {
        messageId: payload.messageId,
      });

      callback({});
    } catch (err) {
      console.log(err.message);
      callback(err.message);
    }
  }

  socket.on("getMessages", getMessages);
  socket.on("sendMessage", sendMessage);
  socket.on("editMessage", editMessage);
  socket.on("reactToMessage", reactToMessage);
  socket.on("deleteMessage", deleteMessage);
  socket.on("readMessages", readMessages);
};
