import { useCallback, useEffect, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";
import {
  ChatContext,
  User,
  type Message,
} from "../../../hooks/useChat/useChat";
import { SOCKET_EVENT } from "../constants";

const SOCKET_URL = "http://localhost:8888";

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const socketRef = useRef<Socket | null>(null);
  //use this ref to ensure it is available for event callbacks
  // using user state  will make its value to be undefined in its lexical scope when callback is invoked
  const userRef = useRef<User | null>(null);

  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [user, setUser] = useState<User | null>(null);

  const sendMessage = useCallback(
    (message: string) => {
      if (!message.trim()) return;

      const socket = socketRef?.current;

      if (socket) {
        socket.emit(SOCKET_EVENT.CLIENT_MESSAGE, {
          id: globalThis.crypto.randomUUID(),
          content: message,
          timestamp: Date.now(),
          userId: user?.id,
        });
      }
    },
    [user]
  );

  const handleConnect = () => setIsConnected(true);

  const handleDisconnect = () => setIsConnected(false);

  const handleError = () => setConnectionError("Connection refused");

  const handleFirstLoad = ({
    messages,
    user,
  }: {
    messages: Message[];
    user: User;
  }) => {
    setMessages(messages);
    setUser(user);
  };

  const handleUserDisconnection = ({ messages }: { messages: Message[] }) => {
    setMessages(messages);
  };

  const handleSocketMessage = (newMessage: Message) =>
    setMessages((prev) => [
      ...prev,
      {
        ...newMessage,
        fromMe: newMessage.userId === userRef.current?.id,
      },
    ]);

  useEffect(() => {
    userRef.current = user;
  }, [user]);

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
    socketRef.current.on(SOCKET_EVENT.USER_DISCONNECT, handleUserDisconnection);

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
      value={{ isConnected, connectionError, messages, user, sendMessage }}
    >
      {children}
    </ChatContext.Provider>
  );
};
