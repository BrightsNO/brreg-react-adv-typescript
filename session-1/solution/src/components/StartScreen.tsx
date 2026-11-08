import type { Question } from "../types";
import { List } from "./List";

type Props = {
  questions: Question[];
  onStart: () => void;
};

export function StartScreen({ questions, onStart }: Props) {
  return (
    <section className="card">
      <h2>Klar for quiz?</h2>
      <p>{questions.length} spørsmål i denne runden:</p>
      <List className="question-list" items={questions} getKey={(q) => q.id} render={(q) => q.text} />
      <button className="primary" onClick={onStart}>
        Start quiz
      </button>
    </section>
  );
}
