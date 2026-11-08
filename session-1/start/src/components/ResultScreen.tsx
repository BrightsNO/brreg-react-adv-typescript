type Props = {
  score: number;
  total: number;
  onRestart: () => void;
};

export function ResultScreen({ score, total, onRestart }: Props) {
  return (
    <section className="card result">
      <h2>Ferdig!</h2>
      <p className="score">
        {score} av {total} riktige
      </p>
      <button className="primary" onClick={onRestart}>
        Spill igjen
      </button>
    </section>
  );
}
