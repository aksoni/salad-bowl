import React, { useState, useEffect } from "react";
import socket from "../socket";

interface Props {
  name: string;
  gameCode: string;
}

const WaitRoom: React.FC<Props> = ({ name, gameCode }) => {
  const [phrases, setPhrases] = useState(["", "", ""]);
    const [transforming, setTransforming] = useState(false); // tracks when we're transforming boxes to veggies
  const [submittedPlayers, setSubmittedPlayers] = useState<string[]>([]);

  const [showConfirmation, setShowConfirmation] = useState(false);
    type Veggie = { src: string; offset: number };
    const [veggies, setVeggies] = useState<Veggie[]>([]);

  const [players, setPlayers] = useState<string[]>([]);

  useEffect(() => {
    socket.on("room_state", ({ players, submitted }) => {
      console.log("👥 Updated player list:", players);
      setPlayers(players);
      setSubmittedPlayers(submitted || []);
    });

    socket.on("all_submitted", () => {
      console.log("🎉 All players submitted!");    
    });

    return () => {
      socket.off("room_state");
    };
  }, []);
  




  const handleChange = (index: number, value: string) => {
    const updated = [...phrases];
    updated[index] = value;
    setPhrases(updated);
  };

  const handleSubmit = () => {
  if (phrases.some((p) => p.trim() === "")) return;

  setTransforming(true);

  // After animation completes
  setTimeout(() => {
    setShowConfirmation(true);
  }, 600); // matches drop duration

  socket.emit("submit_phrases", {
    gameCode,
    name,
    phrases, // the array of 3 strings
  });
};


  const canSubmit = phrases.every((p) => p.trim() !== "");
  const submitted = submittedPlayers.includes(name);

  return (
  <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
    <h2 className="text-3xl font-bold text-green-700 mb-6">
      Welcome, {name}
    </h2>
    <ul className="text-lg">
      {players.map((p) => (
        <li key={p}>
          {submittedPlayers.includes(p) ? "✅" : "🕒"} {p}
        </li>
      ))}
    </ul>
    <p className="mb-8 text-gray-600">Game Code: {gameCode}</p>

    {/* Phrase boxes */}
    <div className="flex flex-col gap-4 w-full max-w-md mb-10">
  {!transforming &&
    phrases.map((phrase, idx) => (
      <textarea
        key={idx}
        value={phrase}
        onChange={(e) => handleChange(idx, e.target.value)}
        placeholder={`Phrase ${idx + 1}`}
        disabled={submitted}
        className="p-3 rounded-xl shadow border resize-none h-20 text-lg focus:outline-none focus:ring-2 focus:ring-green-500"
      />
    ))}

  {transforming &&
    phrases.map((_, idx) => (
      <img
        key={idx}
        src={`/img/veggie${(idx % 3) + 1}.svg`} // rotate between 3 veggies
        alt={`veggie-${idx}`}
        className="w-20 h-20 mx-auto animate-bounce-drop"
        style={{ animationDelay: `${idx * 150}ms` }}
      />
    ))}
</div>


    {/* Bowl + submit button (only show before submit) */}
    <button
  onClick={handleSubmit}
  disabled={!canSubmit || submitted}
  className="group relative flex flex-col items-center transition-transform hover:scale-105 active:scale-95 disabled:opacity-50"
>
  <img
    src="/img/bowl.png"
    alt="Submit Bowl"
    className="w-64 h-auto transition-transform group-hover:scale-105 group-active:scale-95"
  />
  {!submitted && (
    <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-sm text-white font-semibold bg-green-600 px-2 py-1 rounded-full">
      Submit
    </span>
  )}
</button>
<div className="relative h-40 w-full overflow-visible pointer-events-none">
  {veggies.map((veggie, idx) => (
  <img
    key={idx}
    src={veggie.src}
    alt={`veggie-${idx}`}
    className="absolute top-0 w-12 animate-veggie-fall"
    style={{
      left: `calc(50% + ${veggie.offset}px)`,
      animationDelay: `${idx * 150}ms`,
    }}
  />
))}

</div>



    {/* Confirmation appears only after 600ms */}
    {showConfirmation && (
      <div className="text-xl text-green-800 mt-10 font-semibold">
        ✅ Submitted! Waiting for others...
      </div>
    )}
  </div>
);


};

export default WaitRoom;