import { createContext, useContext } from "react";

export type User = {
  id: `${string}-${string}-${string}-${string}-${string}`;
  name: string;
};

export type Message = {
  id: `${string}-${string}-${string}-${string}-${string}`;
  content: string;
  timestamp: number;
};

export type ChatContextType = {
  isConnected: boolean;
  connectionError: string | null;
  messages: Message[];
  user: User | null;
  sendMessage: (message: string) => void;
};

export const ChatContext = createContext<ChatContextType | undefined>(
  undefined
);

export const useChat = () => {
  const context = useContext(ChatContext);

  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }

  return context;
};
