import { useScore } from "../hooks/useScore";
import { usePlayerStore } from "../stores/playerStore";
import type { Question } from "../types";

// Viser spillernavn og poeng øverst i spillet.
// Selectors: komponenten rendres bare på nytt når navnet eller svarene endres.
export function PlayerBar({ questions }: { questions: Question[] }) {
  const name = usePlayerStore((s) => s.name);
  const score = useScore(questions);

  return (
    <div className="player-bar">
      <span>{name || "Gjest"}</span>
      <span>{score} poeng</span>
    </div>
  );
}
