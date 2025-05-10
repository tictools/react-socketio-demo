import { useChat, type Message } from "../../hooks/useChat/useChat";
import { MessageItem } from "../MessageItem/MessageItem";
import styles from "./MessagesList.module.css";

export const MessagesList = () => {
  const { messages } = useChat();

  if (!messages?.length) return null;

  return (
    <ul className={styles["messages__list"]}>
      {messages.map((message: Message) => (
        <MessageItem key={message.id} message={message} />
      ))}
    </ul>
  );
};
