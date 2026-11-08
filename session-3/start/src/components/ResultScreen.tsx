import { useQuizContext } from "../context/QuizContext";
import { scoreByCategory, longestStreak } from "../game/scoring";
import { CATEGORIES, type Question } from "../types";

type Props = {
  questions: Question[];
  answers: number[];
};

export function ResultScreen({ questions, answers }: Props) {
  const { playerName, score, start } = useQuizContext();
  const byCategory = scoreByCategory(questions, answers);

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
      <button className="primary" onClick={start}>
        Spill igjen
      </button>
    </section>
  );
}
