import userModel from "../models/userModel.js";
import { inGroup, isAdmin } from "./groupHandler.js";
import { formatSimpleUser } from "../routes/users.js";

export const leaveCall = (io, socket) => {
  console.log("leaving call");
  console.log(socket.callRoom);
  if (!socket.callRoom) {
    return;
  }
  const room = io.sockets.adapter.rooms.get(socket.callRoom);
  console.log("before delete", room.userObjects[socket.id]);
  delete room.userObjects[socket.id];
  console.log("after delete", room.userObjects[socket.id]);
  delete room.isAdmin[socket.id];
  delete room.mediaValues[socket.id];
  socket.to(socket.callRoom).emit("userDisconnected", socket.id);
  socket.leave(socket.callRoom);
  socket.callRoom = null;
};

export default (io, socket) => {
  const joinCall = async ({ roomId, isVideo, isAudio }) => {
    // leave current call, update callRoom
    const callRoomId = `callRoom-${roomId}`;
    const userId = socket.request.auth.payload["https://example.com/_id"];
    console.log(roomId);
    if (!(await inGroup(userId, roomId))) {
      console.log("failed to get user");
      socket.emit("failJoinRoom");
      return;
    }

    const user = formatSimpleUser(await userModel.findById(userId));

    if (socket.callRoom) {
      console.log("line 20");
      leaveCall(io, socket);
    }
    socket.callRoom = callRoomId;

    const room = io.sockets.adapter.rooms.get(callRoomId);
    const isNewRoom = room ? false : true;

    if (room) {
      // prevent duplicate users in call
      if (room.userObjects) {
        Object.values(room.userObjects).forEach((user) => {
          if (user._id === userId) {
            console.log(room.userObjects);
            socket.emit("failJoinRoom");
            return;
          }
        });
      }

      room.userObjects[socket.id] = user;
      room.mediaValues[socket.id] = { isVideo: isVideo, isAudio: isAudio };
      room.isAdmin[socket.id] = await isAdmin(
        socket.request.auth.payload["https://example.com/_id"],
        roomId
      );
    }

    const otherUsers = [];

    if (room) {
      room.forEach((id) => {
        otherUsers.push({
          inRoomId: id,
          userObject: room.userObjects[id],
          mediaValues: room.mediaValues[id],
        });
      });
    }

    socket.join(callRoomId);
    socket.emit("allUsers", otherUsers);

    if (!isNewRoom) {
      console.log("Sending stuff");
      io.to(socket.id).emit("roomStart", room.startTime);
      socket.emit("setPerms", room.isAdmin[socket.id]);
      socket.emit("recordingSignal", room.isRecording);
      return;
    }

    const newRoom = io.sockets.adapter.rooms.get(callRoomId);
    const startTime = Date.now();

    newRoom.startTime = startTime;
    newRoom.userObjects = {};
    newRoom.isAdmin = {};
    newRoom.mediaValues = {};
    newRoom.userObjects[socket.id] = user;
    newRoom.mediaValues[socket.id] = { isVideo: isVideo, isAudio: isAudio };
    newRoom.isRecording = false;

    //TODO: set this to the actual value
    newRoom.isAdmin[socket.id] = await isAdmin(
      socket.request.auth.payload["https://example.com/_id"],
      roomId
    );
    newRoom.transcript = "";

    io.to(socket.id).emit("setPerms", newRoom.isAdmin[socket.id]);
    io.to(socket.id).emit("roomStart", startTime);
  };

  const sendingSignal = (payload) => {
    if (!socket.callRoom) {
      return;
    }

    io.to(payload.userToSignal).emit("userJoined", {
      signal: payload.signal,
      callerID: payload.callerID,
      userObject: payload.userObject,
      isAudio: payload.mediaValues.isAudio,
      isVideo: payload.mediaValues.isVideo,
    });
  };

  const returningSignal = (payload) => {
    if (!socket.callRoom) {
      return;
    }

    io.to(payload.callerID).emit("receivingReturnedSignal", {
      signal: payload.signal,
      id: socket.id,
    });
  };

  const startRecording = (payload) => {
    if (!socket.callRoom) {
      return;
    }

    const room = io.sockets.adapter.rooms.get(`callRoom-${payload.roomId}`);

    if (!room || !room.isAdmin[socket.id] || room.isRecording) {
      return;
    }

    room.isRecording = true;
    room.recorder = socket.id;
    room.recordingStartTime = Date.now();

    room.forEach((id) => {
      if (room.isAdmin[id]) {
        io.to(id).emit("recordingSignal", true);
      }
    });

    io.to(socket.id).emit("isRecorderSignal", true);
  };

  const stopRecording = (payload) => {
    if (!socket.callRoom) {
      return;
    }

    const room = io.sockets.adapter.rooms.get(`callRoom-${payload.roomId}`);

    if (
      !room ||
      !room.isAdmin[socket.id] ||
      !room.isRecording ||
      !(room.recorder === socket.id)
    ) {
      return;
    }

    socket.emit("isRecorderSignal", false);

    room.forEach((id) => {
      if (room.isAdmin[id]) {
        io.to(id).emit("recordingSignal", false);
      }
    });

    room.isRecording = false;
  };

  const visualAudioChange = (payload) => {
    if (!socket.callRoom) {
      return;
    }

    const room = io.sockets.adapter.rooms.get(`callRoom-${payload.roomId}`);

    if (!room) {
      return;
    }

    room.mediaValues[socket.id] = {
      isAudio: payload.isAudio,
      isVideo: room.mediaValues[socket.id].isVideo,
    };
    io.to(`callRoom-${payload.roomId}`).emit("changeAudio", {
      peerID: socket.id,
      isAudio: payload.isAudio,
    });
  };

  const visualVideoChange = (payload) => {
    if (!socket.callRoom) {
      return;
    }

    const room = io.sockets.adapter.rooms.get(`callRoom-${payload.roomId}`);

    if (!room) {
      return;
    }
    console.log("emmiting now");
    room.mediaValues[socket.id] = {
      isVideo: payload.isVideo,
      isAudio: room.mediaValues[socket.id].isAudio,
    };
    io.to(`callRoom-${payload.roomId}`).emit("changeVideo", {
      peerID: socket.id,
      isVideo: payload.isVideo,
    });
  };

  const appendTranscript = (payload) => {
    const room = io.sockets.adapter.rooms.get(`callRoom-${payload.roomId}`);

    if (!room || !room.userObjects[socket.id]) {
      return;
    }

    room.transcript += `${room.userObjects[socket.id].username}: ${
      payload.voiceText
    } \n`;
    console.log(room.transcript);
  };

  const getTranscriptAndStart = (roomId) => {
    const room = io.sockets.adapter.rooms.get(`callRoom-${roomId}`);

    if (!room || !room.isAdmin[socket.id]) {
      return;
    }
    console.log("sending over");
    console.log("final transcript : " + room.transcript);
    socket.emit("transcriptAndStartSignal", {
      transcript: room.transcript,
      startTime: room.recordingStartTime,
    });
    room.transcript = "";
  };

  socket.on("visualAudioChange", visualAudioChange);
  socket.on("visualVideoChange", visualVideoChange);
  socket.on("getTranscriptAndStart", getTranscriptAndStart);
  socket.on("appendTranscript", appendTranscript);
  socket.on("stopRecording", stopRecording);
  socket.on("startRecording", startRecording);
  socket.on("joinCall", joinCall);
  socket.on("sendingSignal", sendingSignal);
  socket.on("returningSignal", returningSignal);
};
