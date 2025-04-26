import { useChat, type Message } from "../../hooks/useChat/useChat";
import styles from "./MessagesList.module.css";

export const MessagesList = () => {
  const { messages } = useChat();

  if (!messages?.length) return null;

  return (
    <ul className={styles["messages__list"]}>
      {messages.map((message: Message) => (
        <li
          key={message.id}
          className={`${styles["messages__item"]} ${
            message.fromMe
              ? styles["messages__item--sent"]
              : styles["messages__item--received"]
          }`}
        >
          <p className={styles["messages__content"]}>{message.content}</p>
          <span className={styles["messages__timestamp"]}>
            {message.timestamp}
          </span>
        </li>
      ))}
    </ul>
  );
};
