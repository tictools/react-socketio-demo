import { useChat } from "../../hooks/useChat/useChat";

export const User = () => {
  const { user } = useChat();

  return <p>{user?.name ?? "unknown user"}</p>;
};
