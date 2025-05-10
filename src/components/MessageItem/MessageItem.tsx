import { Message } from "../../hooks/useChat/useChat";
import { formatDateTime } from "../../services/Date/formatDateTime";

import styles from "./MessageItem.module.css";

type MessageProps = {
  message: Message;
};

export const MessageItem = ({ message }: MessageProps) => {
  const formattedDateTime = formatDateTime({ milliseconds: message.timestamp });
  return (
    <li
      key={message.id}
      className={`${styles["messages__item"]} ${
        message.fromMe
          ? styles["messages__item--sent"]
          : styles["messages__item--received"]
      }`}
    >
      <p className={styles["messages__content"]}>{message.content}</p>
      <span className={styles["messages__timestamp"]}>{formattedDateTime}</span>
    </li>
  );
};
