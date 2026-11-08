import { countCorrect, scoreByCategory, longestStreak } from "../game/scoring";
import { useSaveResult } from "../hooks/useLeaderboard";
import { usePlayerStore } from "../stores/playerStore";
import { useQuizStore } from "../stores/quizStore";
import { CATEGORIES, type Question } from "../types";
import { ErrorMessage } from "./ErrorMessage";
import { LeaderboardSection } from "./LeaderboardSection";

type Props = {
  questions: Question[];
  answers: number[];
};

export function ResultScreen({ questions, answers }: Props) {
  const playerName = usePlayerStore((s) => s.name);
  const start = useQuizStore((s) => s.start);
  const score = countCorrect(questions, answers);
  const byCategory = scoreByCategory(questions, answers);

  // Nivå 2: lagre resultatet. Kalles fra en event-handler (knappen), ikke fra en effect.
  const save = useSaveResult();
  const result = { name: playerName || "Gjest", score, total: questions.length };

  return (
    <section className="card result">
      <h2>Ferdig, {playerName || "Gjest"}!</h2>
      <p className="score">
        {score} av {questions.length} riktige
      </p>
      <p>Lengste rekke: {longestStreak(questions, answers)} riktige på rad</p>
      <ul className="category-scores">
        {CATEGORIES.map((category) => (
          <li key={category}>
            <span>{category}</span>
            <span>
              {byCategory[category].correct} / {byCategory[category].total}
            </span>
          </li>
        ))}
      </ul>

      <div className="save-result">
        {save.isSuccess ? (
          <p>Resultatet er lagret.</p>
        ) : (
          <button className="primary" disabled={save.isPending} onClick={() => save.mutate(result)}>
            {save.isPending ? "Lagrer …" : "Lagre resultatet"}
          </button>
        )}
        {save.isError && <ErrorMessage message="Kunne ikke lagre resultatet." onRetry={() => save.mutate(result)} />}
      </div>

      <LeaderboardSection />

      <button className="primary" onClick={start}>
        Spill igjen
      </button>
    </section>
  );
}
