import "./App.css";
import { Chat } from "./components/Chat/Chat";
import { SocketStatus } from "./components/SocketStatus/SocketStatus";
import { ChatProvider } from "./contexts/Chat/providers/ChatProvider";

function App() {
  return (
    <>
      <ChatProvider>
        <h1>react-socketio-demo</h1>
        <SocketStatus />
        <Chat />
      </ChatProvider>
    </>
  );
}

export default App;
