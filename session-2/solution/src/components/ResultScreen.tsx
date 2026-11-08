import { countCorrect, scoreByCategory, longestStreak } from "../game/scoring";
import { CATEGORIES, type Question } from "../types";

type Props = {
  questions: Question[];
  answers: number[];
  onRestart: () => void;
};

export function ResultScreen({ questions, answers, onRestart }: Props) {
  // Nivå 1: regnes ut under rendering, ingen state eller effect.
  const score = countCorrect(questions, answers);
  const byCategory = scoreByCategory(questions, answers);

  return (
    <section className="card result">
      <h2>Ferdig!</h2>
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
      <button className="primary" onClick={onRestart}>
        Spill igjen
      </button>
    </section>
  );
}
