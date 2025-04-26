import { useChat } from "../../hooks/useChat/useChat";

export const User = () => {
  const { user } = useChat();

  return (
    <section>
      <p>
        <span>{user?.avatar}</span> {user?.name ?? "unknown user"}!
      </p>
    </section>
  );
};
