import React from "react";
import { Icon } from "@iconify/react";
import { useAuth0 } from "@auth0/auth0-react";

const SideBar = () => {

  const {logout} = useAuth0();

  const logoutWithRedirect = () =>
  logout({
    logoutParams: {
      returnTo: window.location.origin,
    },
  });

  return (
    <div className="sidebar" /*style={{ height: "100vh" }}*/>
      <div className="sidebar-top-links">
        <a href="http://localhost:3000/chat" className="link">
          <Icon icon="bxs:dashboard" color="gray" />
          <span className="icon-text">Chat</span>
        </a>
        <a href="http://localhost:3000/calendar" className="link">
          <Icon icon="uim:calender" color="gray" />
          <span className="icon-text">Calendar</span>
        </a>
        <a href="http://localhost:3000/user-settings" className="link">
          <Icon icon="solar:settings-bold-duotone" color="gray" />
          <span className="icon-text">Settings</span>
        </a>
      </div>
      <div className="sidebar-bottom-links">
        <button onClick={() => logoutWithRedirect()} className="link" style={{background:"black"}}>
          <Icon icon="solar:logout-3-bold-duotone" color="gray" />
          <span className="icon-text">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default SideBar;
