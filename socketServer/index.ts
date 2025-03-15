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

io.on("connection", function (socket) {
  console.log(`🚀 a user connected${socket.id}`);
});

server.listen(PORT, () => {
  console.log(`server running at http://localhost:${PORT}`);
});
