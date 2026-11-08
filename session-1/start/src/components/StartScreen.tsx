type Props = {
  questions: any[];
  onStart: () => void;
};

export function StartScreen({ questions, onStart }: Props) {
  return (
    <section className="card">
      <h2>Klar for quiz?</h2>
      <p>{questions.length} spørsmål i denne runden:</p>
      <ul className="question-list">
        {questions.map((q: any) => (
          <li key={q.id}>{q.text}</li>
        ))}
      </ul>
      <button className="primary" onClick={onStart}>
        Start quiz
      </button>
    </section>
  );
}
