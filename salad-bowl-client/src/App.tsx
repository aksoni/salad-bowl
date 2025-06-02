import React, { useState, useEffect } from "react";
import StartRoom from "./components/StartRoom";
import WaitRoom from "./components/WaitRoom";
import socket from "./socket"

const App: React.FC = () => {
  const [screen, setScreen] = useState<"start" | "wait">("start");
  const [name, setName] = useState("");
  const [gameCode, setGameCode] = useState("");

    useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      console.log("✅ Connected to server:", socket.id);
    });

    socket.on("joined_game", ({ gameCode, name }) => {
      console.log(`🎉 Joined game ${gameCode} as ${name}`);
      // update global game state if needed
    });

    return () => {
      socket.disconnect();
    };
  }, []);


  return (
    <div className="min-h-screen flex items-center justify-center bg-amber-100">
      {screen === "start" && (
        <StartRoom
          onJoin={(name, code) => {
            setName(name);
            setGameCode(code);
            setScreen("wait");
          }}
        />
      )}
      {screen === "wait" && <WaitRoom name={name} gameCode={gameCode} />}
    </div>
  );
};

export default App;