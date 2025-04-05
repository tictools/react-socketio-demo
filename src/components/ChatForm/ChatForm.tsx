import { useChat } from "../../contexts/Chat/hooks/useChat/useChat";

export const ChatForm = () => {
  const { sendMessage } = useChat();

  const handleSendMessage = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const target = event.target as HTMLFormElement;

    const formData = new FormData(target);
    const message = formData.get("message-content") as string;

    sendMessage(message);

    target.reset();
  };

  return (
    <form onSubmit={handleSendMessage} role="form">
      <input type="text" name="message-content" aria-label="message-content" />
      <button type="submit">Send</button>
    </form>
  );
};
