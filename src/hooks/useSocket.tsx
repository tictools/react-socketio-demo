import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:8888";

export const useSocket = () => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socket = io(SOCKET_URL);

    socket.on("connect", () => {
      setIsConnected(true);
      console.log("✅ Connected to WebSocket server");
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
      console.log("✅ Disonnected to WebSocket server");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return { isConnected };
};
