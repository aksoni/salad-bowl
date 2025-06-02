import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});
const rooms: Record<string, string[]> = {};
const roomPhrases: Record<string, { [name: string]: string[] }> = {};
const roomSubmitted: Record<string, Set<string>> = {};

app.use(cors());
app.use(express.json());

const PORT = 3001;

app.get("/", (_req, res) => {
  res.send("Salad Bowl server is running 🎉");
});

io.on("connection", (socket) => {
  console.log("🟢 Connected:", socket.id);

  socket.on("join_game", (payload) => {
    console.log("📩 join_game payload:", payload);
    const { gameCode, name } = payload || {};
    if (!gameCode || !name) {
      console.log("⚠️ Missing gameCode or name");
      return;
    }

    console.log(`🙋 ${name} joined room ${gameCode}`);
    socket.join(gameCode);

    if (!rooms[gameCode]) {
      rooms[gameCode] = [];
    }
    rooms[gameCode].push(name);
    console.log("👥 Updated player list:", rooms[gameCode]);

    if (!roomSubmitted[gameCode]) {
      roomSubmitted[gameCode] = new Set();
    }


    io.to(gameCode).emit("room_state", {
      players: rooms[gameCode],
      submitted: Array.from(roomSubmitted[gameCode]),
    })

    socket.emit("joined_game", { gameCode, name });
  });

  socket.on("submit_phrases", ({ gameCode, name, phrases }) => {
    console.log(`📝 ${name} submitted phrases in ${gameCode}`);

    if (!roomPhrases[gameCode]) roomPhrases[gameCode] = {};
    roomPhrases[gameCode][name] = phrases;

    if (!roomSubmitted[gameCode]) roomSubmitted[gameCode] = new Set();
    roomSubmitted[gameCode].add(name);

    const allPlayers = rooms[gameCode] || [];
    const submittedPlayers = roomSubmitted[gameCode];

    const allSubmitted = allPlayers.every((p) => submittedPlayers.has(p));

    io.to(gameCode).emit("room_state", {
      players: allPlayers,
      submitted: Array.from(submittedPlayers),
    });

    if (allSubmitted) {
      io.to(gameCode).emit("all_submitted");
    }
  });


  socket.on("disconnect", () => {
    console.log("🔴 Disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`✅ Server listening on http://localhost:${PORT}`);
});
