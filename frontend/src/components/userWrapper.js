import React from "react";

function UserWrapper(props) {
  if (props.user === "none") {
    window.location = "http://localhost:3000";
  } else {
    return <>{props.children}</>;
  }

  return <></>;
}

export default UserWrapper;
