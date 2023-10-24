import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { Auth0Provider } from "@auth0/auth0-react";
import history from "./utils/history";
import { getAuth0Config } from "./config/auth0Config";
// Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";
// Bootstrap Bundle JS
import "bootstrap/dist/js/bootstrap.bundle.min";

const onRedirectCallback = (appState) => {
  history.push(
    appState && appState.returnTo ? appState.returnTo : window.location.pathname
  );
};

const auth0Config = getAuth0Config();
const providerConfig = {
  domain: auth0Config.domain,
  clientId: auth0Config.clientId,
  onRedirectCallback,
  authorizationParams: {
    redirect_uri: window.location.origin,
    ...(auth0Config.audience ? { audience: auth0Config.audience } : null),
  },
};


const root = createRoot(document.getElementById("root"));
root.render(
  <Auth0Provider {...providerConfig}>
    <App />
  </Auth0Provider>
);

serviceWorker.unregister();
