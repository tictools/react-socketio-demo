import "./App.css";
import { Chat } from "./components/Chat/Chat";
import { SocketStatus } from "./components/SocketStatus/SocketStatus";
import { User } from "./components/User/User";
import { ChatProvider } from "./contexts/Chat/providers/ChatProvider";

function App() {
  return (
    <>
      <ChatProvider>
        <h1>react-socketio-demo</h1>
        <User />
        <SocketStatus />
        <Chat />
      </ChatProvider>
    </>
  );
}

export default App;
