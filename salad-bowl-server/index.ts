import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

app.use(cors());
app.use(express.json());

const PORT = 3001;

app.get("/", (_req, res) => {
  res.send("Salad Bowl server is running 🎉");
});

io.on("connection", (socket) => {
  console.log(`🟢 User connected: ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`🔴 User disconnected: ${socket.id}`);
  });

  socket.on("ping", () => {
    console.log("📡 Got ping");
    socket.emit("pong");
  });
});

server.listen(PORT, () => {
  console.log(`✅ Server listening on http://localhost:${PORT}`);
});
