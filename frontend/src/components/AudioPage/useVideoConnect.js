import io from "socket.io-client";
import { useAuth0 } from "@auth0/auth0-react";
import { React, useEffect, useRef, useState, useMemo } from "react";
import useGetToken from "../../utils/useGetToken";
import MultiStreamsMixer from "multistreamsmixer";

function useVideoConnect(id, user) {
  const socketRef = useRef();
  const peersRef = useRef([]);
  const recorderRef = useRef();
  const chunks = useRef([]);
  const isSave = useRef(false);
  const [peers, setPeers] = useState([]);
  const [userVideo, setUserVideo] = useState(null);
  const [startTime, setStart] = useState(null);
  const [isAdmin, setAdmin] = useState(false);
  const [isRecording, setRecording] = useState(false);
  const [isRecorder, setRecorder] = useState(false);
  const [streams, setStreams] = useState([]);
  const token = useGetToken();

  useEffect(() => {
    if (!isRecorder || !recorderRef.current) {
      return;
    }
    console.log("new mixed");
    recorderRef.current.stop();
    const mixed = new MultiStreamsMixer([
      ...streams.map((streamObj) => streamObj.stream),
      userVideo != null && userVideo,
    ]);

    recorderRef.current = new MediaRecorder(mixed.getMixedStream());
    startRecording();
  }, [streams]);

  useEffect(() => {
    if (!isRecorder) {
      return;
    }

    const handleTabClose = (event) => {
      if (!isRecorder || !recorderRef.current || !socketRef.current) {
        return;
      }
      socketRef.current.emit("stopRecording", { roomId: id });

      // if (recognition.current) {
      //   recognition.current.stop()
      // }
      isSave.current = true;
      stopRecording();
    };

    window.addEventListener("beforeunload", handleTabClose);

    return () => {
      window.removeEventListener("beforeunload", handleTabClose);
    };
  }, [isRecorder]);

  async function saveRecording() {
    if (!isSave.current) {
      return;
    }
    socketRef.current.emit("getTranscriptAndStart", id);
    console.log("going to save recording");
    isSave.current = false;
  }

  function stopRecording() {
    if (recorderRef.current && recorderRef.current.state === "recording") {
      recorderRef.current.stop();
    }
  }

  function startRecording() {
    recorderRef.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.current.push(event.data);
        saveRecording();
      }
    };

    recorderRef.current.start();
  }

  function setInitalAudio(userStream) {
    setStreams((peerStreams) => {
      const mixed = new MultiStreamsMixer([
        ...peerStreams.map((streamObj) => streamObj.stream),
        userStream != null && userStream,
      ]);

      console.log([
        ...peerStreams.map((streamObj) => streamObj.stream),
        userStream != null && userStream,
      ]);

      recorderRef.current = new MediaRecorder(mixed.getMixedStream());
      startRecording();
      return peerStreams;
    });
  }

  useEffect(() => {
    if (!token || !user) return;

    function createPeer(userToSignal, callerID, stream) {
      const peer = new window.SimplePeer({
        initiator: true,
        trickle: false,
        stream,
      });

      peer.on("signal", (signal) => {
        socketRef.current.emit("sendingSignal", {
          userToSignal,
          callerID,
          signal,
          userObject: user,
          mediaValues: {
            isVideo: stream.getVideoTracks()[0].enabled,
            isAudio: stream.getAudioTracks()[0].enabled,
          },
        });
      });

      peer.on("error", (e) => {
        console.log({ ERROR1: e });
      });

      return peer;
    }

    function addPeer(incomingSignal, callerID, stream) {
      const peer = new window.SimplePeer({
        initiator: false,
        trickle: false,
        stream,
      });

      peer.on("signal", (signal) => {
        socketRef.current.emit("returningSignal", { signal, callerID });
      });

      peer.on("error", (e) => {
        console.log({ ERROR2: e });
      });

      peer.signal(incomingSignal);

      return peer;
    }

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        console.log(stream);
        setUserVideo(stream);
        console.log("connecting to socket");
        console.log(token);
        console.log(socketRef.current);
        socketRef.current = new io("http://localhost:4200", {
          withCredentials: true,
          extraHeaders: {
            authorization: `Bearer ${token}`,
          },
        });

        socketRef.current.emit("joinCall", {
          roomId: id,
          isAudio: stream.getAudioTracks()[0].enabled,
          isVideo: stream.getVideoTracks()[0].enabled,
        });

        socketRef.current.on("roomStart", (time) => {
          setStart(time);
        });

        socketRef.current.on("setPerms", (isAdmin) => {
          setAdmin(isAdmin);
        });

        socketRef.current.on("failJoinRoom", () => {
          window.location = "http://localhost:3000";
        });

        socketRef.current.on("transcriptAndStartSignal", (payload) => {
          const recordedBlob = new Blob(chunks.current, { type: "audio/webm" });
          const formData = new FormData();

          // Append the recorded blob to the FormData object with a specific field name
          formData.append("audioFile", recordedBlob, "recordedAudio.webm"); // Third argument is the file name
          formData.append(
            "callDetails",
            JSON.stringify({
              startTimestamp: payload.startTime,
              endTimestamp: Date.now(),
              transcript: payload.transcript,
            })
          );

          fetch(`http://localhost:4200/api/v1/groups/${id}/calls`, {
            method: "POST",
            mode: "cors",
            body: formData,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }).then((res) => console.log(res));

          // const a = document.createElement("a");
          // a.href = url;
          // a.download = "recorded_audio.webm";
          // a.click();
          chunks.current = [];
        });

        socketRef.current.on("allUsers", (payload) => {
          const peers = [];
          const peerStreams = [];
          payload.forEach((user) => {
            const inRoomId = user.inRoomId;
            const userObj = user.userObject;
            const mediaValues = user.mediaValues;
            const peer = createPeer(inRoomId, socketRef.current.id, stream);

            peer.on("stream", (peerStream) => {
              console.log(mediaValues);
              peerStreams.push({
                peerID: inRoomId,
                stream: peerStream,
                isAudio: mediaValues.isAudio,
                isVideo: mediaValues.isVideo,
              });
            });

            peersRef.current.push({
              peerID: inRoomId,
              peer,
            });

            peers.push({
              peerID: inRoomId,
              userObj: userObj,
              peer,
            });
          });
          setPeers(peers);
          setStreams(peerStreams);
        });

        socketRef.current.on("userJoined", (payload) => {
          const peer = addPeer(payload.signal, payload.callerID, stream);
          console.log(payload.isAudio, payload.isVideo);

          peer.on("stream", (peerStream) => {
            setStreams((prevStreams) => [
              ...prevStreams,
              {
                peerID: payload.callerID,
                stream: peerStream,
                isAudio: payload.isAudio,
                isVideo: payload.isVideo,
              },
            ]);
          });

          peersRef.current.push({
            peerID: payload.callerID,
            peer,
          });

          const peerObj = {
            peer,
            peerID: payload.callerID,
            userObj: payload.userObject,
          };

          setPeers((users) => {
            return [
              ...users.filter((peer) => peer.peerID !== payload.callerID),
              peerObj,
            ];
          });
        });

        socketRef.current.on("changeAudio", (payload) => {
          setStreams((curStreams) => {
            return curStreams.map((streamValues) => {
              return streamValues.peerID === payload.peerID
                ? {
                    isAudio: payload.isAudio,
                    isVideo: streamValues.isVideo,
                    stream: streamValues.stream,
                    peerID: streamValues.peerID,
                  }
                : streamValues;
            });
          });
        });

        socketRef.current.on("changeVideo", (payload) => {
          console.log("chaning audio");
          setStreams((curStreams) => {
            return curStreams.map((streamValues) => {
              return streamValues.peerID === payload.peerID
                ? {
                    isAudio: streamValues.isAudio,
                    isVideo: payload.isVideo,
                    stream: streamValues.stream,
                    peerID: streamValues.peerID,
                  }
                : streamValues;
            });
          });
        });

        socketRef.current.on("recordingSignal", (state) => {
          setRecording(state);
        });

        socketRef.current.on("isRecorderSignal", (state) => {
          setRecorder(state);
          if (!state) {
            isSave.current = true;
            stopRecording();
            return;
          }
          setInitalAudio(stream);
        });

        socketRef.current.on("receivingReturnedSignal", (payload) => {
          const item = peersRef.current.find((p) => p.peerID === payload.id);
          item.peer.signal(payload.signal);
        });

        socketRef.current.on("userDisconnected", (id) => {
          console.log(id);

          const peerObj = peersRef.current.find((p) => p.peerID === id);
          if (peerObj) {
            peerObj.peer.destroy();
          }
          const peers = peersRef.current.filter((p) => p.peerID !== id);
          peersRef.current = peers;

          setStreams((peerStreams) => {
            return peerStreams.filter((peerObj) => peerObj.peerID !== id);
          });
          setPeers(peers);
        });
      });
    return () => {
      socketRef.current.off("roomStart");
      socketRef.current.off("setPerms");
      socketRef.current.off("allUsers");
      socketRef.current.off("userJoined");
      socketRef.current.off("recordingSignal");
      socketRef.current.off("isRecorderSignal");
      socketRef.current.off("receivingReturnedSignal");
      socketRef.current.off("userDisconnected");
      socketRef.current.disconnect();
    };
  }, [id, token, user]);

  return {
    peers,
    userVideo,
    socketRef,
    isAdmin,
    isRecording,
    isRecorder,
    streams,
    startTime,
  };
}

export default useVideoConnect;
