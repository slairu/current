import React, { useEffect, useState } from "react";
import logoYO from "./current-white2.png"; // Adjust the path if necessary

const LoadingScreen = () => {
  useEffect(() => {
    setTimeout(() => {
      // After 2 seconds, redirect to your chat page or dashboard
    }, 200000);
  }, []);

  //   .message.last-seen-message {
  //     background-color: #f2f2f2;
  //     position: relative;
  //   }

  //   .message.last-seen-message::before {
  //     position: absolute;
  //     bottom: -18px;
  //     left: 2px;
  //     background-color: #4CAF50;
  //     content: "Online";
  //     background-color: #FFC107;
  //     content: "Away";

  //     background-color: #F44336;
  //     content: "Busy";
  //     padding: 4px 8px;
  //     border-radius: 4px;
  //     font-weight: bold; /* Make the indicator bold */
  //     font-family: "Helvetica Neue", sans-serif;
  //     font-size: 10px;
  //     color: #fff; /* Text color for the checkmark */
  //     opacity: 0; /* Hide the indicator by default */
  //     transition: opacity 0.3s ease-in-out; /* Add smooth transition for hover effect */
  //   }

  //   .message.last-seen-message:hover::before {
  //     opacity: 1; /* Show the indicator on hover */
  //   }

  // Inline styles for the loading screen and the entire page
  const loadingScreenStyles = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    height: "100vh",
    width: "100vw",
    position: "absolute",
    top: "0",
    left: "0",
    zIndex: "9999",
  };

  // Updated logoStyles to include CSS animation for growth
  const logoStyles = {
    height: "auto",

    width: "auto",
    animation: "growLogo 5s infinite alternate",
  };

  // Updated whiteLineStyles to include CSS animation for growth
  const whiteLineStyles = {
    width: "0",
    height: "3px",
    background: "white",
    marginTop: "20px",
    animation: "growLine 2s linear forwards",
  };

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        const newProgress = prevProgress + 0.3;
        return newProgress <= 100 ? newProgress : 100;
      });
    }, 1);

    setTimeout(() => {
      // After 2 seconds, redirect to your chat page or dashboard
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  // ... (rest of the code)

  // CSS animation keyframes for the logo growth
  const keyframes = `@keyframes growLogo {
   
  }
  @keyframes growLine {
    0% {
      width: -20;
    }
    100% {
      width: 20;
    }
  }`;

  // Add the animation keyframes to a new style element
  const styleElement = document.createElement("style");
  styleElement.appendChild(document.createTextNode(keyframes));
  document.head.appendChild(styleElement);

  return (
    <div style={loadingScreenStyles}>
      {/* Your app's logo image */}
      <img id="logo-img" src={logoYO} alt="Logo" style={logoStyles} />
      {/* White line */}
      <div style={whiteLineStyles} />
      {/* Progress bar */}
      <progress value={progress} max="100" />

      {/* Loading text */}
    </div>
  );
};

export default LoadingScreen;
