import React, { useState, useEffect } from "react";
import socket from "../socket";

interface Props {
  onJoin: (name: string, gameCode: string) => void;
}

const StartRoom: React.FC<Props> = ({ onJoin }) => {
  const [gameCode, setGameCode] = useState("");
  const [name, setName] = useState("");

  const handleJoin = () => {
    const code = gameCode.trim().toUpperCase();
    const playerName = name.trim();
    if (!code || !playerName) return;

    console.log("📤 Emitting join_game", { gameCode: code, name: playerName });

    socket.emit("join_game", { gameCode: code, name: playerName });

    onJoin(playerName, code);
  };

  return (
    <div className="flex flex-col items-center gap-4 mt-16">
      <h1 className="text-5xl font-bold text-green-700">Salad Bowl</h1>
      <input
        value={gameCode}
        onChange={(e) => setGameCode(e.target.value)}
        placeholder="Game Code"
        className="border p-3 rounded text-center text-xl w-64"
      />
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your Name"
        className="border p-3 rounded text-center text-xl w-64"
      />
      <button
        onClick={handleJoin}
        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded text-xl"
      >
        Join Game
      </button>
    </div>
  );
};

export default StartRoom;