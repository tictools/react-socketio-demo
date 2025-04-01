# react-socketio-demo

This project is for practicing the implementation of sockets in a React application.

## Project Requirements

- Create a React app with Vite and use Vitest for testing.
- Use socket.io as the socket client.
- Include a persistence system in the client/server communication using json-server.

## Step 1: Set up the development environment

Before implementing WebSockets, we need a functional environment. Follow these steps:

1. **Initialize the project**: Create a new React application with Vite.
2. **Configure Vitest**: Ensure Vitest is installed and tests can be run.
3. **Add json-server**: Configure it to manage persistent data.
4. **Create a basic backend with express and socket.io**: Set up a server that accepts connections.

### Goal of this step

By the end of this step, you should have:

- A React app created with Vite.
- A json-server running with some initial data.
- A WebSocket server (with express and socket.io) that accepts connections, but without any functionality yet.

> [!TIP] Enable CORS in socket.io:
> Ensure the WebSocket server allows connections from different origins to avoid issues when connecting the React client.

---

## Step 2: Connect the React client with WebSockets

Now that the server is running, we will add the WebSocket client to React.

### Goals of this step:

1. Install `socket.io-client` and connect the React client to the WebSocket server.
2. Display on the screen when a user connects or disconnects.
3. Write a basic test to check that the React component renders correctly.

### Step requirements

#### 1. Install `socket.io-client`

Run:

```sh
npm install socket.io-client
```

#### 2. Create a `useSocket` hook to manage the connection

Define a hook that:

- Creates a connection with the WebSocket server.
- Listens to connection and disconnection events.
- Returns the connection state (`isConnected`).

Example implementation (`src/hooks/useSocket.ts`):

```ts
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:8888";

export const useSocket = () => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socket = io(SOCKET_URL);

    socket.on("connect", () => {
      setIsConnected(true);
      console.log("✅ Connected to WebSocket server");
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
      console.log("❌ Disconnected from WebSocket server");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return { isConnected };
};
```

#### 3. Create a `SocketStatus.tsx` component to display the connection status

Create a component that shows `"Connected"` in green or `"Disconnected"` in red according to the socket state.

```tsx
import { useSocket } from "../hooks/useSocket";

export const SocketStatus = () => {
  const { isConnected } = useSocket();

  return (
    <div>
      <h2>WebSocket Status:</h2>
      <p style={{ color: isConnected ? "green" : "red" }}>
        {isConnected ? "Connected ✅" : "Disconnected ❌"}
      </p>
    </div>
  );
};
```

#### 4. Add a test for `SocketStatus.tsx`

Write a basic test to ensure the component renders correctly.

Example test (`src/hooks/__tests__/SocketStatus.test.tsx`):

```ts
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { SocketStatus } from "../../components/SocketStatus";

describe("SocketStatus", () => {
  it("should display the text 'WebSocket Status:'", () => {
    render(<SocketStatus />);
    expect(screen.getByText("WebSocket Status:")).toBeInTheDocument();
  });
});
```

### Verify it works

- Run the React application (`npm run dev`).
- Ensure the text `"Connected ✅"` appears when the server is on.
- Stop the WebSocket server and verify it changes to `"Disconnected ❌"`.
- Run the tests (`npm test`).

When you have completed this, share your solution for review. 🔥

---

## **Step 3: Send and receive messages with persistence**

Now we will add functionality so that clients can send messages through WebSockets, and these messages are saved in `json-server`, ensuring persistence.

### **Goals of this step:**

1️⃣ Add an endpoint to `json-server` to manage messages.  
2️⃣ Allow the React client to send messages to the WebSocket server.  
3️⃣ Make the WebSocket server:

- Save the messages to `json-server`.
- Forward the messages to all connected clients.  
  4️⃣ Display the stored messages when a client connects.

---

## **Step requirements**

### **1️⃣ Configure `json-server` to store messages**

- Modify `db.json` to include a structure for storing messages.
- Ensure `json-server` is running correctly.

---

### **2️⃣ Modify the WebSocket server**

- When a client connects, it should receive the list of stored messages.
- When a client sends a message, the server should:
  1. Save the message to `json-server`.
  2. Forward the message to all connected clients.

---

### **3️⃣ Implement a `useChat` hook in the React client**

This hook should:

- Manage the WebSocket connection.
- Load stored messages upon connection.
- Listen for new incoming messages.
- Allow sending messages to the WebSocket server.

---

### **4️⃣ Create a `Chat.tsx` component**

This component should:

- Display the list of messages in real-time.
- Include a text field for the user to write a message.
- Send the message when the corresponding button is clicked.

---

### **5️⃣ Add tests with Vitest**

- Verify that the `Chat.tsx` component renders correctly.
- (Optional) Write tests to ensure messages are displayed correctly.

---

## **Verify it works**

1️⃣ **Run `json-server`** and ensure it is working.  
2️⃣ **Start the WebSocket server** and verify it accepts connections.  
3️⃣ **Launch the React application** and check:  
 ✅ Old messages load correctly.  
 ✅ New messages are saved and displayed in real-time.  
 ✅ When one client sends a message, others receive it.
