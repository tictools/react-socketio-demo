import { useCallback, useEffect, useState } from "react";
import { io, type Socket } from "socket.io-client";

const SOCKET_URL = "/"; // pointing root path due vite proxy config

export type Message = {
  id: number;
  content: string;
  timestamp: number;
};

export const useChat = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  const sendMessage = useCallback(
    (message: string) => {
      if (!message || !message.trim()) return;

      if (socket) {
        socket.emit("clientMessage", {
          content: `${message} :: ${socket.id}`,
          timestamp: Date.now(),
        });
      } else {
        console.error("Socket is not connected");
      }
    },
    [socket]
  );

  useEffect(() => {
    const socketInstance = io(SOCKET_URL, {
      reconnectionAttempts: 5,
      reconnectionDelay: 5000,
    });

    setSocket(socketInstance);

    socketInstance.on("connect", () => {
      setIsConnected(true);
      console.log("✅ Connected to WebSocket server");
    });

    socketInstance.on("connect_error", () => {
      setConnectionError("Connection refused");
    });

    socketInstance.on("firstLoad", (data) => {
      setMessages(data.messages);
    });

    socketInstance.on("socketMessage", (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    socketInstance.on("disconnect", () => {
      setIsConnected(false);
      console.log("✅ Disonnected to WebSocket server");
    });

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return { isConnected, connectionError, messages, sendMessage };
};
