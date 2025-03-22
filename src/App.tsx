import "./App.css";
import { SocketStatus } from "./components/SocketStatus";
import { Message, useSocket } from "./hooks/useSocket";

function App() {
  const { isConnected, connectionError, messages, sendMessage } = useSocket();
  return (
    <>
      <h1>react-socketio-demo</h1>
      {connectionError && <h3>{connectionError}</h3>}
      <SocketStatus isConnected={isConnected} />
      {messages.length === 0 && <h3>No messages</h3>}
      {messages.length !== 0 && (
        <h3>
          {messages.map((message: Message) => (
            <p key={message.id}>
              {message.content} ⏰ <span>{message.timestamp.toString()}</span>
            </p>
          ))}
        </h3>
      )}
      <button
        onClick={() => {
          sendMessage("This is message from client");
        }}
      >
        Send message
      </button>
    </>
  );
}

export default App;
