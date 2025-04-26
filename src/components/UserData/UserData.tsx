import { useChat } from "../../hooks/useChat/useChat";
import { UserName } from "../UserName/UserName";
import { UserStatus } from "../UserStatus/UserStatus";

export const UserData = () => {
  const { user } = useChat();

  return (
    <section>
      <UserName avatar={user?.avatar} name={user?.name} />
      <UserStatus />
    </section>
  );
};
