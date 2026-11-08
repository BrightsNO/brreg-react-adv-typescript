import { useEffect, useState } from "react";
import { countCorrect, scoreByCategory } from "../game/scoring";
import { CATEGORIES, type Question, type ScoreByCategory } from "../types";

type Props = {
  questions: Question[];
  answers: number[];
  onRestart: () => void;
};

const EMPTY: ScoreByCategory = {
  react: { correct: 0, total: 0 },
  typescript: { correct: 0, total: 0 },
  web: { correct: 0, total: 0 },
};

export function ResultScreen({ questions, answers, onRestart }: Props) {
  const [score, setScore] = useState(0);
  const [byCategory, setByCategory] = useState<ScoreByCategory>(EMPTY);

  useEffect(() => {
    setScore(countCorrect(questions, answers));
    setByCategory(scoreByCategory(questions, answers));
  }, [questions, answers]);

  return (
    <section className="card result">
      <h2>Ferdig!</h2>
      <p className="score">
        {score} av {questions.length} riktige
      </p>
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
