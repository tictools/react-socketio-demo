import { useChat } from "../../hooks/useChat/useChat";

export const User = () => {
  const { user } = useChat();

  return <p>👋 Welcome {user?.name ?? "unknown user"}!</p>;
};
