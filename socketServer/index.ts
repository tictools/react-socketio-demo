import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { SOCKET_EVENT } from "../src/contexts/Chat/constants";
import type { Message, User } from "../src/hooks/useChat/useChat";

const PORT = 8888;

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "DELETE"],
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

  let userDTO: User | undefined;

  try {
    const usersFetchPromise = globalThis.fetch(`${BASE_URL}/users`);
    const messagesFetchPromise = globalThis.fetch(`${BASE_URL}/messages`);

    const [usersResponse, messagesResponse] = await Promise.all([
      usersFetchPromise,
      messagesFetchPromise,
    ]);

    const usersDTO: User[] | [] = await usersResponse.json();
    const initialMessagesDTO = await messagesResponse.json();

    userDTO = usersDTO.find((user) => user.id === socket.id);

    if (!userDTO) {
      const newUserResponse = await globalThis.fetch(`${BASE_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: socket.id, name: `User: ${socket.id}` }),
      });

      userDTO = (await newUserResponse.json()) as User;
    }

    socket.emit(SOCKET_EVENT.FIRST_LOAD, {
      messages: initialMessagesDTO,
      user: userDTO,
    });
  } catch {
    console.log("🚀 ~ Failed to fetch data");
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

  socket.on(SOCKET_EVENT.DISCONNECT, async () => {
    let deletedUserDTO: User;

    try {
      const deletedUserResponse = await fetch(
        `${BASE_URL}/users/${socket.id}`,
        {
          method: "DELETE",
        }
      );

      const deletedMessagesResponse = await globalThis.fetch(
        `${BASE_URL}/messages/?userId=${socket.id}`
      );

      if (!deletedMessagesResponse.ok) {
        throw new Error(`Failed to fetch messages when disconnecting`);
      }

      const deletedMessagesDTO =
        (await deletedMessagesResponse.json()) as Message[];

      const deletedMessagesPromises = deletedMessagesDTO.map(
        (message: Message) => {
          return globalThis.fetch(`${BASE_URL}/messages/${message.id}`, {
            method: "DELETE",
          });
        }
      );

      const deletedMessages = await Promise.all(deletedMessagesPromises);

      if (
        !deletedUserResponse.ok ||
        deletedMessages.some((response) => !response.ok)
      ) {
        throw new Error(`Failed to delete user or some messages`);
      }

      deletedUserDTO = (await deletedUserResponse.json()) as User;

      const messagesResponse = await globalThis.fetch(`${BASE_URL}/messages`);

      const currentMessagesDTO = await messagesResponse.json();

      io.emit(SOCKET_EVENT.USER_DISCONNECT, {
        messages: currentMessagesDTO,
        user: userDTO,
      });

      console.log(`🗑️ User deleted :: ${deletedUserDTO.name}`);
      console.log(`🧹 Deleted ${deletedMessagesDTO.length} messages`);
      console.log(`🚀 User disconnected :: ${deletedUserDTO.id}`);
    } catch (err) {
      console.error("Error during DELETE:", err);
    }
  });
});

server.listen(PORT, () => {
  console.log(`server running at http://localhost:${PORT}`);
});
