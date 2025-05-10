import { useChat } from "../../hooks/useChat/useChat";
import { SocketStatusError } from "../SocketStatusError/SocketStatusError";

import styles from "./UserStatus.module.css";

export const UserStatus = () => {
  const { isConnected, connectionError } = useChat();

  if (connectionError) {
    return <SocketStatusError />;
  }

  const paragraphClassName = isConnected
    ? styles["message__content--connected"]
    : styles["message__content--disconnected"];

  return (
    <p>
      status:
      <span className={paragraphClassName}>{isConnected ? " ✅" : "  ❌"}</span>
    </p>
  );
};
