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
  console.log("🟢 Connected:", socket.id);

  socket.on("ping", () => {
    console.log("📡 Got ping");
    socket.emit("pong");
  });
  socket.onAny((event, ...args) => {
  console.log(`📥 Got event: ${event}`, args);
});

  socket.on("join_game", (payload) => {
    console.log("📩 join_game payload:", payload);
    const { gameCode, name } = payload || {};
    if (!gameCode || !name) {
      console.log("⚠️ Missing gameCode or name");
      return;
    }

    console.log(`🙋 ${name} joined room ${gameCode}`);
    socket.join(gameCode);

    socket.emit("joined_game", { gameCode, name });
    socket.to(gameCode).emit("player_joined", { name });
  });


  socket.on("disconnect", () => {
    console.log("🔴 Disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`✅ Server listening on http://localhost:${PORT}`);
});
