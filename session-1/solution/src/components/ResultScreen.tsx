import { CATEGORIES, type ScoreByCategory } from "../types";

type Props = {
  score: number;
  total: number;
  /** Ekstra A: poeng per kategori. */
  byCategory: ScoreByCategory;
  onRestart: () => void;
};

export function ResultScreen({ score, total, byCategory, onRestart }: Props) {
  return (
    <section className="card result">
      <h2>Ferdig!</h2>
      <p className="score">
        {score} av {total} riktige
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
