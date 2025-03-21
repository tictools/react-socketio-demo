import { useSocket } from "../hooks/useSocket";
import styles from "./SocketStatus.module.css";

export const SocketStatus = () => {
  const { isConnected } = useSocket();

  const paragraphClassName = isConnected
    ? styles["message__content--connected"]
    : styles["message__content--disconnected"];

  return (
    <div>
      <h2>WebSocket Status:</h2>
      <p className={paragraphClassName}>
        {isConnected ? "Connected ✅" : "Disconnected ❌"}
      </p>
    </div>
  );
};
