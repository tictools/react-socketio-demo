import { useChat } from "../../hooks/useChat/useChat";

export const EmptyMessagesList = () => {
  const { messages } = useChat();

  if (messages?.length) return null;

  return <h4>No messages</h4>;
};
