import { useEffect, useState } from "react";
import type { Question } from "../types";

type Props = {
  question: Question;
  number: number;
  total: number;
  /** Svaret spilleren valgte, eller null hvis svaret ikke skal vises ennå. */
  selected: number | null;
  onAnswer: (choice: number) => void;
  onNext: () => void;
};

export function QuestionCard({ question, number, total, selected, onAnswer, onNext }: Props) {
  const [clicked, setClicked] = useState<number | null>(null);
  const revealed = selected !== null;

  // Nullstill klikket når vi får et nytt spørsmål.
  useEffect(() => {
    setClicked(null);
  }, [question.id]);

  // Send svaret videre når spilleren har klikket.
  useEffect(() => {
    if (clicked !== null) onAnswer(clicked);
  }, [clicked]);

  return (
    <section className="card">
      <p className="progress">
        Spørsmål {number} av {total} · {question.category}
      </p>
      <h2>{question.text}</h2>

      <div className="options">
        {question.options.map((option, i) => {
          let className = "option";
          if (revealed && i === question.correct) className += " option-correct";
          if (revealed && i === selected && i !== question.correct) className += " option-wrong";
          return (
            <button key={option} className={className} disabled={revealed} onClick={() => setClicked(i)}>
              {option}
            </button>
          );
        })}
      </div>

      {revealed && (
        <div className="reveal">
          <p>{selected === question.correct ? "Riktig!" : "Feil svar."}</p>
          <button className="primary" onClick={onNext}>
            {number < total ? "Neste spørsmål" : "Se resultat"}
          </button>
        </div>
      )}
    </section>
  );
}
