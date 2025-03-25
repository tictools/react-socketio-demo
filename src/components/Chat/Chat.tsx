import { ChatForm } from "../ChatForm/ChatForm";
import { ChatWrapper } from "../ChatWrapper/ChatWrapper";
import { EmptyMessagesList } from "../EmptyMessagesList/EmptyMessagesList";
import { MessagesList } from "../MessagesList/MessagesList";

export const Chat = () => {
  return (
    <>
      <h3>Chat</h3>
      <ChatWrapper>
        <EmptyMessagesList />
        <MessagesList />
        <ChatForm />
      </ChatWrapper>
    </>
  );
};
