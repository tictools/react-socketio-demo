import { createContext, useContext } from "react";

export type Message = {
  id: `${string}-${string}-${string}-${string}-${string}`;
  content: string;
  timestamp: number;
};

export type ChatContextType = {
  isConnected: boolean;
  connectionError: string | null;
  messages: Message[];
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
