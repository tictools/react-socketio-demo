import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { SOCKET_EVENT } from "../src/contexts/Chat/constants";
import { type Message } from "../src/contexts/Chat/hooks/useChat/useChat";

const PORT = 8888;

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

const BASE_URL = "http://localhost:3000";

app.get("/", (_req, res) => {
  res.json({ project: "react-socket.io-demo" }).end();
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok", message: "socket.io server running..." });
});

io.on(SOCKET_EVENT.CONNECT, async function (socket) {
  console.log(`🚀 a user connected :: ${socket.id}`);

  try {
    const newUserResponse = await globalThis.fetch(`${BASE_URL}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: socket.id, name: "foo" }),
    });
    const newUser = await newUserResponse.json();

    const initialMessagesResponse = await globalThis.fetch(
      `${BASE_URL}/messages`
    );
    const initialMessages = await initialMessagesResponse.json();

    socket.emit(SOCKET_EVENT.FIRST_LOAD, {
      messages: initialMessages,
      user: newUser,
    });
  } catch {
    console.log("🚀 ~ Failed to fetch messages");
  }

  socket.on(SOCKET_EVENT.CLIENT_MESSAGE, async (message: Message) => {
    try {
      const response = await globalThis.fetch(
        "http://localhost:3000/messages",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(message),
        }
      );

      const newMessage = (await response.json()) as Message;

      io.emit(SOCKET_EVENT.SOCKET_MESSAGE, newMessage);
    } catch {
      console.log("🚀 ~ Failed to create message");
    }
  });

  socket.on(SOCKET_EVENT.DISCONNECT, () => {
    console.log(`🚀 a user disconnected :: ${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log(`server running at http://localhost:${PORT}`);
});
