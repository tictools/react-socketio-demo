import "./App.css";
import { Chat } from "./components/Chat/Chat";
import { ChatHeading } from "./components/ChatHeading/ChatHeading";
import { UserData } from "./components/UserData/UserData";
import { ChatProvider } from "./contexts/Chat/providers/ChatProvider";

function App() {
  return (
    <>
      <ChatProvider>
        <ChatHeading />
        <UserData />
        <Chat />
      </ChatProvider>
    </>
  );
}

export default App;
