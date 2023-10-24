import React, { useRef, useEffect } from "react"
import "./styles/ProfilePicture.css"
import styled from "styled-components";
import { Icon } from '@iconify/react';

const StyledVideo = styled.video`
    height: 100%;
    width: 100%;
`;

function ProfilePicture(props) {
    const videoRef = useRef();


    useEffect(() => {
        console.log(props.mediaValues)
        if (props.video) {
            videoRef.current.srcObject = props.video;
        }
        
    }, [props.video]);

    if (!props.mediaValues) { return (<div></div>) }
    return (
        <div className={`profileImage ${props.imageClass}`}>
            {!props.userObj ? <StyledVideo muted playsInline autoPlay ref={videoRef}/> : <StyledVideo playsInline autoPlay ref={videoRef} />}
            <div className="tagDisplay">
                <div className="nameTag">{props.userObj ? props.userObj.username : "Me"}</div>
                <div>
                {!props.mediaValues.isAudio && <Icon icon="bi:mic-mute-fill" width="40" height="40" />}
                {!props.mediaValues.isVideo && <Icon icon="bi:camera-video-off-fill" width="40" height="40" />}
                </div>
    
                {/* { props.mediaValues && (props.mediaValues.isAudio ? <img src = "../mic-off.svg" alt="My Happy SVG"/>: <img src = "../mic-on.svg" alt="My Happy SVG"/>)} */}
                {/* <div>{props.mediaValues ? props.mediaValues.isVideo && "XD" : ""}</div>
                <div>{props.mediaValues ? props.mediaValues.isAudio && "XD" : ""}</div> */}
            </div>
        </div>
    );
}

export default ProfilePicture;