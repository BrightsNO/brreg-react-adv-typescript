import { useQuizContext } from "../context/QuizContext";

// Viser spillernavn og poeng øverst i spillet.
export function PlayerBar() {
  const { playerName, score } = useQuizContext();

  return (
    <div className="player-bar">
      <span>{playerName || "Gjest"}</span>
      <span>{score} poeng</span>
    </div>
  );
}
