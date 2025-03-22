import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";

const PORT = 8888;

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

app.get("/", (_req, res) => {
  res.json({ project: "react-socket.io-demo" }).end();
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok", message: "socket.io server running..." });
});

io.on("connection", async function (socket) {
  console.log(`🚀 a user connected :: ${socket.id}`);

  try {
    const response = await globalThis.fetch("http://localhost:3000/messages");
    const data = await response.json();

    socket.emit("firstLoad", { messages: data });
  } catch {
    console.log("🚀 ~ Failed to fetch messages");
  }

  socket.on("clientMessage", async (message) => {
    try {
      const response = await globalThis.fetch(
        "http://localhost:3000/messages",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(message),
        }
      );

      const newMessage = await response.json();
      console.log("🚀 ~ socket.on ~ newMessage:", newMessage);

      io.emit("socketMessage", newMessage);
    } catch {
      console.log("🚀 ~ Failed to create message");
    }
  });

  socket.on("disconnect", () => {
    console.log(`🚀 a user disconnected :: ${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log(`server running at http://localhost:${PORT}`);
});
