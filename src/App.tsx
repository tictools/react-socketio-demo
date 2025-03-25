import "./App.css";
import { Chat } from "./components/Chat/Chat";
import { SocketStatus } from "./components/SocketStatus/SocketStatus";

function App() {
  return (
    <>
      <h1>react-socketio-demo</h1>
      <SocketStatus />
      <Chat />
    </>
  );
}

export default App;
