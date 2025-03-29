import { Message, useChat } from "../../hooks/useChat/useChat";

export const MessagesList = () => {
  const { messages } = useChat();

  if (!messages?.length) return null;

  return (
    <>
      {messages.map((message: Message) => (
        <p key={message.id}>
          {message.content} ⏰ <span>{message.timestamp.toString()}</span>
        </p>
      ))}
    </>
  );
};
