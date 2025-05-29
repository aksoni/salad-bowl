import React, { useState } from "react";
import StartRoom from "./components/StartRoom";
import WaitRoom from "./components/WaitRoom";

const App: React.FC = () => {
  const [screen, setScreen] = useState<"start" | "wait">("start");
  const [name, setName] = useState("");
  const [gameCode, setGameCode] = useState("");

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