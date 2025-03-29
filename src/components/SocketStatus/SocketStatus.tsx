import { useChat } from "../../hooks/useChat/useChat";
import { SocketStatusError } from "../SocketStatusError/SocketStatusError";
import styles from "./SocketStatus.module.css";

export const SocketStatus = () => {
  const { isConnected, connectionError } = useChat();

  if (connectionError) {
    return <SocketStatusError />;
  }

  const paragraphClassName = isConnected
    ? styles["message__content--connected"]
    : styles["message__content--disconnected"];

  return (
    <div>
      <h2>WebSocket Status:</h2>
      <span className={paragraphClassName}>
        {isConnected ? "Connected ✅" : "Disconnected ❌"}
      </span>
    </div>
  );
};
