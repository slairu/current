import React from "react"
import { useState, useEffect } from "react";
import './styles/PersonView.css';
import ProfilePicture from "./ProfilePicture";


function PersonView(props) {
    const maxUsers = 5


    return (
        <div className="PersonView">
            <div className="viewPortion">
                <button className="viewButton">
                    <span className="material-symbols-outlined speakerButton" onClick={() => {props.setSpeakerView(true)}} style={props.isSpeakerView ? {} : {color: "gray"}}>speaker_group</span>
                </button>
                <button className="viewButton" style={props.isSpeakerView ? {color: "gray"} : {}} onClick={() => {props.setSpeakerView(false)}}>
                    <span className="material-symbols-outlined galleryButton">gallery_thumbnail</span>
                </button>
            </div>
            <div className="userContainer">
                <ProfilePicture imageClass={"speakerImage"} userVideo={props.userVideo} isVideo={props.isVideo} />
                {props.peers.slice(0, maxUsers).map((peer) => {
                    return <ProfilePicture imageClass={"speakerImage"} key={peer.peerID} isVideo={peer.isVideo} peerID={peer.peerID} peer={peer.peer} />
                })}
            </div>
        </div>
    )    
};
  

export default PersonView;