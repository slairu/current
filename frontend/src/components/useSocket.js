import React, { useRef, useEffect, useState } from "react";
import io from "socket.io-client";
import useGetToken from "../utils/useGetToken";

function useSocket() {
  const token = useGetToken();
  const socketRef = useRef();
  const [socketLoaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!token) return;
    socketRef.current = new io("http://localhost:4200", {
      withCredentials: true,
      extraHeaders: {
        authorization: `Bearer ${token}`,
      },
    });
    setLoaded(true);
    console.log(socketRef.current, token);
  }, [token]);

  return { socketRef, socketLoaded };
}

export default useSocket;
