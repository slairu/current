import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { dbReq, secureReq } from "../demo/test";

function ProfileComponent(props) {
  const { getAccessTokenSilently } = useAuth0();
  return (
    <div>
      <button onClick={dbReq}>Test adding to db</button>
      <button
        onClick={() => {
          secureReq(getAccessTokenSilently);
        }}
      >
        Test secure api call
      </button>
    </div>
  );
}

export default ProfileComponent;
