import { useChat } from "../../contexts/Chat/hooks/useChat/useChat";

export const User = () => {
  const { user } = useChat();

  return <p>{user?.name ?? "unknown user"}</p>;
};
