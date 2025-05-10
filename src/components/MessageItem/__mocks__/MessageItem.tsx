import { Message } from "../../../hooks/useChat/useChat";

export const MessageItem = ({ message }: { message: Partial<Message> }) => (
  <li data-testid="mock-message-item">{message.content}</li>
);
