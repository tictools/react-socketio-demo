import { useCallback, useEffect, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";
import { SOCKET_EVENT } from "../constants";
import { ChatContext, type Message } from "../hooks/useChat/useChat";

const SOCKET_URL = "http://localhost:8888";

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const socketRef = useRef<Socket | null>(null);

  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  const sendMessage = useCallback((message: string) => {
    if (!message.trim()) return;

    const socket = socketRef?.current;

    if (socket) {
      socket.emit(SOCKET_EVENT.CLIENT_MESSAGE, {
        id: globalThis.crypto.randomUUID(),
        content: message,
        timestamp: Date.now(),
      });
    }
  }, []);

  const handleConnect = () => setIsConnected(true);
  const handleDisconnect = () => setIsConnected(false);
  const handleError = () => setConnectionError("Connection refused");
  const handleFirstLoad = ({ messages }: { messages: Message[] }) =>
    setMessages(messages);
  const handleSocketMessage = (newMessage: Message) =>
    setMessages((prev) => [...prev, newMessage]);

  useEffect(() => {
    if (socketRef.current) return;

    socketRef.current = io(SOCKET_URL, {
      reconnectionAttempts: 5,
      reconnectionDelay: 5000,
    });

    socketRef.current.on(SOCKET_EVENT.CONNECT, handleConnect);
    socketRef.current.on(SOCKET_EVENT.CONNECT_ERROR, handleError);
    socketRef.current.on(SOCKET_EVENT.FIRST_LOAD, handleFirstLoad);
    socketRef.current.on(SOCKET_EVENT.SOCKET_MESSAGE, handleSocketMessage);
    socketRef.current.on(SOCKET_EVENT.DISCONNECT, handleDisconnect);

    return () => {
      if (!socketRef.current) return;

      socketRef.current.off(SOCKET_EVENT.CONNECT, handleConnect);
      socketRef.current.off(SOCKET_EVENT.CONNECT_ERROR, handleError);
      socketRef.current.off(SOCKET_EVENT.FIRST_LOAD, handleFirstLoad);
      socketRef.current.off(SOCKET_EVENT.SOCKET_MESSAGE, handleSocketMessage);
      socketRef.current.off(SOCKET_EVENT.DISCONNECT, handleDisconnect);

      socketRef.current.disconnect();
      socketRef.current = null;
    };
  }, []);

  return (
    <ChatContext.Provider
      value={{ isConnected, connectionError, messages, sendMessage }}
    >
      {children}
    </ChatContext.Provider>
  );
};
