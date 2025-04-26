import "./App.css";
import { Chat } from "./components/Chat/Chat";
import { ChatHeading } from "./components/ChatHeading/ChatHeading";
import { SocketStatus } from "./components/SocketStatus/SocketStatus";
import { User } from "./components/User/User";
import { ChatProvider } from "./contexts/Chat/providers/ChatProvider";

function App() {
  return (
    <>
      <ChatProvider>
        <ChatHeading />
        <User />
        <SocketStatus />
        <Chat />
      </ChatProvider>
    </>
  );
}

export default App;
