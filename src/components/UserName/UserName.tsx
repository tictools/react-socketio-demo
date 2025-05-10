import { User } from "../../hooks/useChat/useChat";

type UserDataProps = {
  avatar?: User["avatar"];
  name?: User["name"];
};

export const UserName = ({ avatar, name }: UserDataProps) => {
  const normalizedAvatar = avatar ?? "👻";
  const normalizedName = name ?? "unknown user";

  return (
    <p>
      <span>{normalizedAvatar}</span>
      <span>{normalizedName}!</span>
    </p>
  );
};
