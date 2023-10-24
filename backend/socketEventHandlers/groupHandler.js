import { format } from "morgan";
import groupModel from "../models/groupModel.js";
import userModel from "../models/userModel.js";
import { formatSimpleUser, getUserId } from "../routes/users.js";
import { mongoose } from "mongoose";

export async function inGroup(userId, groupId) {
  if (!mongoose.isValidObjectId(userId) || !mongoose.isValidObjectId(groupId))
    return false;
  return Boolean(
    await userModel.findOne({
      _id: userId,
      groups: { $elemMatch: { group: groupId } },
    })
  );
}

export async function isAdmin(userId, groupId) {
  if (!mongoose.isValidObjectId(userId) || !mongoose.isValidObjectId(groupId))
    return false;
  return Boolean(
    await userModel.findOne({
      _id: userId,
      groups: { $elemMatch: { group: groupId, roles: "admin" } },
    })
  );
}

export default (io, socket) => {
  function leaveGroupRoom(userId, roomId) {
    console.log("user", userId, "leaving room", roomId);
    const sockets = io.in(userId);
    if (!sockets) return false;
    sockets.socketsLeave(roomId);
    return true;
  }

  function joinGroupRoom(userId, roomId) {
    console.log("user", userId, "joining room", roomId);
    const sockets = io.in(userId);
    if (!sockets) return false;
    sockets.socketsJoin(roomId);
    return true;
  }

  function formatSimpleGroup(group) {
    return {
      _id: group._id.toString(),
      name: group.name,
      description: group.description,
    };
  }

  async function createGroup(payload, callback) {
    try {
      const loggedInId = getUserId(socket.request);

      const groupQuery = {
        name: payload.groupDetails.name,
        description: payload.groupDetails.description,
        announcements: [],
        tags: [],
        private: true,
      };

      const newGroup = await groupModel.create(groupQuery);
      // remove logged in user from accounts if sent
      payload.accounts = payload.accounts.filter(
        (userId) => userId !== loggedInId
      );
      // add group to all users
      await userModel.updateMany(
        { _id: { $in: [payload.accounts] } },
        {
          $push: {
            groups: {
              group: newGroup._id,
              roles: ["member"],
            },
          },
        }
      );
      // add group to logged in user
      const added = await userModel.findByIdAndUpdate(loggedInId, {
        $push: {
          groups: {
            group: newGroup._id,
            roles: ["admin"],
          },
        },
      });
      console.log("added: ", added);
      payload.accounts.push(loggedInId);

      // find users in group and remove their groups from res
      const users = await userModel
        .find({ _id: { $in: payload.accounts } })
        .select({
          _id: 1,
          username: 1,
          email: 1,
          profilePicture: 1,
          phoneNumber: 1,
          bio: 1,
        });

      // add users to room
      users.forEach((user) => {
        joinGroupRoom(user._id.toString(), newGroup._id.toString());
      });

      // inform users of new group
      users.forEach((user) => {
        io.to(newGroup._id).emit("receiveGroupInvite", newGroup, user);
      });

      // add users to response group
      const resGroup = newGroup.toJSON();
      resGroup.users = users.map((user) => {
        const roles =
          user._id.toString() === loggedInId ? ["admin"] : ["member"];
        user.profilePicture =
          user.profilePicture ||
          "https://soccerpointeclaire.com/wp-content/uploads/2021/06/default-profile-pic-e1513291410505.jpg";
        return { user: user, roles: roles };
      });
      console.log("resGroup", resGroup);

      callback(resGroup);
    } catch (err) {
      callback(err);
      console.log(err);
    }
  }

  async function addToGroup(payload, callback) {
    try {
      if (!(await isAdmin(getUserId(socket.request), payload.groupId))) {
        throw new Error(
          "You cannot add a user to a group you are not an admin of"
        );
      }
      // null if user already in group
      const addedUser = await userModel.findOneAndUpdate(
        { _id: payload.userId, "groups.group": { $ne: payload.groupId } },
        {
          $push: { groups: { group: payload.groupId, roles: ["member"] } },
        }
      );
      if (!addedUser) {
        const user = await userModel.findById(payload.userId);
        if (!user) {
          throw new Error("user not found");
        }
        throw new Error("user already in group");
      }

      // must exist or admin error thrown
      const group = formatSimpleGroup(
        await groupModel.findById(payload.groupId)
      );

      const joined = joinGroupRoom(payload.userId, payload.groupId);
      io.to(payload.groupId).emit("receiveGroupInvite", {
        group: group,
        user: addedUser,
      });

      callback({ message: "user added to group" });
    } catch (err) {
      callback(err);
      console.log(err);
    }
  }

  async function removeFromGroup(payload, callback) {
    try {
      if (!(await isAdmin(getUserId(socket.request), payload.groupId))) {
        throw new Error(
          "You cannot remove a user from a group you are not an admin of"
        );
      }
      if (payload.userId === getUserId(socket.request)) {
        throw new Error("You cannot remove yourself from a group");
      }

      // null if user not found, exists but doesn't have target group if not in group
      const removedUser = await userModel.findOneAndUpdate(
        { _id: payload.userId },
        { $pull: { groups: { group: payload.groupId } } },
        { new: false }
      );
      if (!removedUser) {
        throw new Error("user not found");
      }
      if (
        !removedUser.groups.find(
          (group) => group.group.toString() === payload.groupId
        )
      ) {
        throw new Error("user not in group");
      }
      delete removedUser.groups;
      const group = formatSimpleGroup(
        await groupModel.findById(payload.groupId)
      );
      // inform all users in group about removal
      io.to(payload.groupId).emit("receiveGroupRemoval", {
        group: group,
        user: removedUser,
      });
      // false if user offline
      const left = leaveGroupRoom(payload.userId, payload.groupId);
      callback({ message: "removed user from group" });
    } catch (err) {
      console.log("caught error", err.message);
      callback(err.message);
    }
  }

  async function getGroups(callback) {
    try {
      const userGroups = await userModel.findById(getUserId(socket.request));
      let groups = [];
      // If groups is an array of group IDs, loop through them
      for (const group of userGroups.groups) {
        // Find the corresponding group document in the group collection
        const groupDocument = formatSimpleGroup(
          await groupModel.findById(group.group)
        );

        groups.push(groupDocument);
        // Do something with the group document
        console.log(groupDocument);
      }

      callback(groups);
    } catch (err) {
      callback(err);
      console.log(err);
    }
  }

  async function getGroupUsers(payload, callback) {
    try {
      const groupId = payload.groupId;
      console.log("userId: ", getUserId(socket.request), "groupId: ", groupId);
      if (!(await inGroup(getUserId(socket.request), groupId))) {
        throw new Error("You are not in this group");
      }

      // find users in group and remove their groups from res
      const users = await userModel
        .find({ groups: { $elemMatch: { group: groupId } } })
        .select({
          _id: 1,
          username: 1,
          email: 1,
          profilePicture: 1,
          phoneNumber: 1,
          bio: 1,
          "groups.$": 1,
        });
      const usersFormatted = users.map((user) => {
        const formatted = formatSimpleUser(user);
        formatted.roles = user.groups[0].roles;
        delete formatted.groups;
        return formatted;
      });
      callback({ users: usersFormatted });
    } catch (err) {
      callback(err);
      console.log(err);
    }
  }

  async function leaveGroup(payload, callback) {
    try {
      const userId = getUserId(socket.request);
      if (await isAdmin(getUserId(socket.request), payload.groupId)) {
        throw new Error("You cannot leave a group you are an admin of");
      }
      const removedUser = await userModel.findOneAndUpdate(
        { _id: userId },
        { $pull: { groups: { group: payload.groupId } } },
        { new: false }
      );
      if (!removedUser) {
        throw new Error(
          "system error - signed in user not found in db. make sure to sign out when deleting account"
        );
      }
      if (
        !removedUser.groups.find(
          (group) => group.group.toString() === payload.groupId
        )
      ) {
        throw new Error("you are not a part of this group");
      }
      const group = formatSimpleGroup(
        await groupModel.findById(payload.groupId)
      );
      // remove groups field from user object before returning
      delete removedUser.groups;
      console.log(removedUser);
      io.to(payload.groupId).emit("receiveGroupRemoval", removedUser, group);
      const left = leaveGroupRoom(userId, payload.groupId);
      console.log(left);
      callback({ message: "left room successfully" });
    } catch (err) {
      callback(err.message);
      console.log(err);
    }
  }
  socket.on("createGroup", createGroup);
  socket.on("getGroups", getGroups);
  socket.on("getGroupUsers", getGroupUsers);
  socket.on("addToGroup", addToGroup);
  socket.on("removeFromGroup", removeFromGroup);
  socket.on("leaveGroup", leaveGroup);
};
