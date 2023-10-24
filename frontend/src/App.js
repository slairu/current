import React from "react";
import { Router, Route, Switch } from "react-router-dom";
import Home from "./views/Home";
import Profile from "./views/Profile";
import VideoPage from "./components/AudioPage/VideoPage";
import ChattingFunction from "./components/ChattingPage/Chat";
import CallRecord from "./components/CallRecordPage/CallRecord";
import Calendar from "./components/Calendar/Calendar.js";
import UserSettings from "./components/UserSettings/UserSettings";

import history from "./utils/history";
import SignupPage from "./components/SignupLoginPage/SignupPage";

// styles
import "./App.css";

// fontawesome
import initFontAwesome from "./utils/initFontAwesome";
initFontAwesome();

const App = () => {
  // const { isLoading, error } = useAuth0();

  // if (error) {
  //   return <div>Oops... {error.message}</div>;
  // }

  // if (isLoading) {
  //   return <Loading />;
  // }

  return (
    <Router history={history}>
      <div id="app" className="d-flex flex-column h-100">
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/profile" component={Profile} />
          <Route path="/user-settings" component={UserSettings} />
          <Route path="/:id/call" component={VideoPage} />
          <Route path="/signup" component={SignupPage} />
          <Route path="/calendar" component={Calendar} />
          <Route path="/chat" component={ChattingFunction} />
          <Route path="/:id/call-history" component={CallRecord} />
          <Route path="/calendar" component={Calendar} />
        </Switch>
      </div>
    </Router>
  );
};

export default App;
