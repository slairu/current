import { React, useEffect, useRef, useState } from "react";
import PersonView from "./PersonView";
import "./styles/VideoFeed.css";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import useVideoConnect from "./useVideoConnect";
import ProfilePicture from "./ProfilePicture";
import useGallery from "./useGallery";
import useUser from "../../utils/useUser.js";
import { Icon } from "@iconify/react";

function VideoFeed(props) {
  const { id } = useParams();
  const recognition = useRef(null);
  const galleryRef = useRef(null);
  const galleryViewRef = useRef(null);
  const [roomTimer, setTimer] = useState(null);
  const user = useUser();

  const {
    peers,
    userVideo,
    socketRef,
    isAdmin,
    isRecording,
    isRecorder,
    streams,
    startTime,
  } = useVideoConnect(id, user);
  useGallery(peers, galleryRef, startTime);

  useEffect(() => {
    if (!startTime) {
      return;
    }
    startSpeechRecognition();
    return () => {
      stopSpeechRecognition();
    };
  }, [startTime]);

  const handleRecognitionStart = () => {
    // Add your logic here for handling recognition start
    console.log("starting ");
  };

  const handleRecognitionResult = (event) => {
    // Add your logic here for handling recognition results
    if (!userVideo.getAudioTracks()[0].enabled) {
      return;
    }
    console.log("sending over");
    const { transcript } = event.results[event.results.length - 1][0];
    socketRef.current.emit("appendTranscript", {
      voiceText: transcript,
      roomId: id,
    });
  };

  const handleRecognitionError = (event) => {
    // Add your logic here for handling recognition errors
    console.log("Speech recognition error:", event.error);
  };

  const handleRecognitionEnd = () => {
    // Add your logic here for handling recognition end
    console.log("stoping ");
    recognition.current.start();
  };

  const startSpeechRecognition = () => {
    if (!userVideo || recognition.current) {
      return;
    }

    recognition.current = new window.webkitSpeechRecognition();
    recognition.current.continuous = true;
    recognition.current.interimResults = false;

    recognition.current.onstart = handleRecognitionStart;
    recognition.current.onresult = handleRecognitionResult;
    recognition.current.onerror = handleRecognitionError;
    recognition.current.onend = handleRecognitionEnd;

    recognition.current.start();
  };

  const stopSpeechRecognition = () => {
    if (recognition.current) {
      console.log("removing stuff");
      recognition.current.removeEventListener(
        "onstart",
        handleRecognitionStart
      );
      recognition.current.removeEventListener(
        "onresult",
        handleRecognitionResult
      );
      recognition.current.removeEventListener(
        "onerror",
        handleRecognitionError
      );
      recognition.current.removeEventListener("onend", handleRecognitionEnd);
    }
  };

  useEffect(() => {
    if (!startTime) {
      return;
    }

    const intervalId = setInterval(() => {
      setTimer(Date.now() - startTime);
    }, 1000);

    // Cleanup the interval on component unmount
    return () => {
      clearInterval(intervalId);
    };
  }, [startTime]);

  if (!startTime) return <div></div>;

  return (
    <>
      <div className="videoFeedPage">
        <GalleryView
          socketRef={socketRef}
          roomTimer={roomTimer}
          galleryViewRef={galleryViewRef}
          galleryRef={galleryRef}
          peers={peers}
          userVideo={userVideo}
          isRecording={isRecording}
          isAdmin={isAdmin}
          isRecorder={isRecorder}
          streams={streams}
        />
      </div>
    </>
  );
}

function toggleState(stateFun) {
  stateFun((curState) => !curState);
}

function SpeakerView(props) {
  const peers = props.peers;
  const userVideo = props.userVideo;
  const setSpeakerView = props.setSpeakerView;
  const isSpeakerView = props.isSpeakerView;
  const socketRef = props.socketRef;

  return (
    <>
      <PeopleOverlay
        isSpeakerView={isSpeakerView}
        userVideo={userVideo}
        peers={peers}
        setSpeakerView={setSpeakerView}
        socketRef={socketRef}
      />
    </>
  );
}

function RoomTimer(props) {
  // Format the time into hours, minutes, and seconds
  function formatTime(time) {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);

    const formattedHours = hours.toString().padStart(2, "0");
    const formattedMinutes = minutes.toString().padStart(2, "0");
    const formattedSeconds = seconds.toString().padStart(2, "0");

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  }

  return (
    <div className="roomTimer">
      {formatTime(Math.max(props.roomTimer, 0) / 1000)}
    </div>
  );
}

function GalleryView(props) {
  const peers = props.peers;
  const userVideo = props.userVideo;
  const setSpeakerView = props.setSpeakerView;
  const isSpeakerView = props.isSpeakerView;
  const roomTimer = props.roomTimer;
  const socketRef = props.socketRef;
  const isAdmin = props.isAdmin;
  const isRecording = props.isRecording;
  const isRecorder = props.isRecorder;
  const streams = props.streams;
  const [userIsVideo, setIsVideo] = useState(false);
  const [userIsAudio, setIsAudio] = useState(false);

  useEffect(() => {
    if (!userVideo) {
      return;
    }

    setIsAudio(userVideo.getAudioTracks()[0].enabled);
    setIsVideo(userVideo.getVideoTracks()[0].enabled);
  }, [userVideo]);

  return (
    <>
      <RoomTimer roomTimer={roomTimer} />
      <PeopleOverlay
        isSpeakerView={isSpeakerView}
        userVideo={userVideo}
        peers={peers}
        setSpeakerView={setSpeakerView}
        socketRef={socketRef}
        isAdmin={isAdmin}
        isRecording={isRecording}
        isRecorder={isRecorder}
        setIsAudio={setIsAudio}
        setIsVideo={setIsVideo}
        userIsAudio={userIsAudio}
        userIsVideo={userIsVideo}
      />
      <div ref={props.galleryViewRef} className="galleryView">
        <div ref={props.galleryRef} className="galleryContainer">
          <ProfilePicture
            width={props.width}
            height={props.height}
            mediaValues={{ isAudio: userIsAudio, isVideo: userIsVideo }}
            video={userVideo}
          />
          {peers.map((peer) => {
            return (
              <ProfilePicture
                width={props.width}
                height={props.height}
                key={peer.peerID}
                peer={peer.peer}
                userObj={peer.userObj}
                video={
                  streams.find(
                    (peerStreamObj) => peerStreamObj.peerID === peer.peerID
                  ) &&
                  streams.find(
                    (peerStreamObj) => peerStreamObj.peerID === peer.peerID
                  ).stream
                }
                mediaValues={
                  streams.find(
                    (peerStreamObj) => peerStreamObj.peerID === peer.peerID
                  ) &&
                  streams.find(
                    (peerStreamObj) => peerStreamObj.peerID === peer.peerID
                  )
                }
              />
            );
          })}
        </div>
      </div>
    </>
  );
}

function PeopleOverlay(props) {
  const { id } = useParams();
  const userVideo = props.userVideo;
  const socketRef = props.socketRef;
  const isAdmin = props.isAdmin;
  const isRecording = props.isRecording;
  const isRecorder = props.isRecorder;
  const setIsVideo = props.setIsVideo;
  const setIsAudio = props.setIsAudio;
  const userIsVideo = props.userIsVideo;
  const userIsAudio = props.userIsAudio;
  const mediaSizes = 50;
  return (
    <>
      {/* <PersonView
        isSpeakerView={isSpeakerView}
        setSpeakerView={setSpeakerView}
        peers={peers}
        userVideo={userVideo}
        isAudio={isAudio}
        isVideo={isVideo}
      /> */}
      <div className="buttonSection">
        <div className="buttonSectionLeft">
          <button
            className="userButton"
            onClick={() => {
              if (!userVideo) {
                return;
              }
              userVideo.getVideoTracks()[0].enabled =
                !userVideo.getVideoTracks()[0].enabled;
              socketRef.current.emit("visualVideoChange", {
                isVideo: userVideo.getVideoTracks()[0].enabled,
                roomId: id,
              });
              toggleState(setIsVideo);
            }}
          >
            {userIsVideo ? (
              <Icon
                icon="bi:camera-video-fill"
                width={mediaSizes}
                height={mediaSizes}
                color={"black"}
              />
            ) : (
              <Icon
                icon="bi:camera-video-off-fill"
                width={mediaSizes}
                height={mediaSizes}
                color={"black"}
              />
            )}
          </button>
          <button
            className="userButton"
            onClick={() => {
              if (!userVideo) {
                return;
              }

              userVideo.getAudioTracks()[0].enabled =
                !userVideo.getAudioTracks()[0].enabled;
              socketRef.current.emit("visualAudioChange", {
                isAudio: userVideo.getAudioTracks()[0].enabled,
                roomId: id,
              });
              toggleState(setIsAudio);
            }}
          >
            {userIsAudio ? (
              <Icon
                icon="bi:mic-fill"
                width={mediaSizes}
                height={mediaSizes}
                color={"black"}
              />
            ) : (
              <Icon
                icon="bi:mic-mute-fill"
                width={mediaSizes}
                height={mediaSizes}
                color={"black"}
              />
            )}
          </button>
          {isAdmin && !isRecording && (
            <button
              className="userButton startRecording"
              onClick={() =>
                socketRef.current.emit("startRecording", { roomId: id })
              }
            >
              Record audio
            </button>
          )}
          {isRecorder && (
            <button
              className="userButton stopRecording"
              onClick={() =>
                socketRef.current.emit("stopRecording", { roomId: id })
              }
            >
              Stop recording
            </button>
          )}
        </div>
        <div className="buttonSectionRight">
          <button
            onClick={() => {
              window.location = "http://localhost:3000";
            }}
            className="userButton"
          >
            <Icon
              icon="bi:box-arrow-left"
              width={mediaSizes + 10}
              height={mediaSizes + 10}
              color={"black"}
            />
          </button>
        </div>
      </div>
    </>
  );
}

export default VideoFeed;
