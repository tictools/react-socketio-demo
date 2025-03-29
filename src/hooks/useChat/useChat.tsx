import { useCallback, useEffect, useState } from "react";
import { io, type Socket } from "socket.io-client";

import { SOCKET_EVENT } from "./constants";

const SOCKET_URL = "http://localhost:8888";

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
        socket.emit(SOCKET_EVENT.CLIENT_MESSAGE, {
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

    socketInstance.on(SOCKET_EVENT.CONNECT, () => {
      setIsConnected(true);
    });

    socketInstance.on(SOCKET_EVENT.CONNECT_ERROR, () => {
      setConnectionError("Connection refused");
    });

    socketInstance.on(SOCKET_EVENT.FIRST_LOAD, (data) => {
      setMessages(data.messages);
    });

    socketInstance.on(SOCKET_EVENT.SOCKET_MESSAGE, (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    socketInstance.on(SOCKET_EVENT.DISCONNECT, () => {
      setIsConnected(false);
    });

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return { isConnected, connectionError, messages, sendMessage };
};
