import { useEffect } from "react";
import { useCountdown } from "../hooks/useCountdown";
import { NO_ANSWER } from "../game/scoring";
import type { Question } from "../types";

export const SECONDS_PER_QUESTION = 20;

type Props = {
  question: Question;
  number: number;
  total: number;
  /** Live-demo, steg 1: poeng så langt, regnet ut i useQuiz. */
  score: number;
  /** Svaret spilleren valgte, eller null hvis svaret ikke skal vises ennå. */
  selected: number | null;
  onAnswer: (choice: number) => void;
  onTimeout: () => void;
  onNext: () => void;
};

// Nivå 1: klikket sendes rett videre i onClick, og nullstilling ved nytt spørsmål
// skjer med key i QuizGame. Ingen effects for det.
export function QuestionCard({ question, number, total, score, selected, onAnswer, onTimeout, onNext }: Props) {
  const revealed = selected !== null;

  // Live-demo, steg 2–4: nedtelling i en egen hook.
  const secondsLeft = useCountdown(SECONDS_PER_QUESTION, onTimeout);

  // Nivå 2: svar med tastene 1–4. Tastaturet er utenfor React, så her er en effect riktig.
  useEffect(() => {
    if (revealed) return;
    function onKeyDown(e: KeyboardEvent) {
      const i = Number(e.key) - 1;
      if (i >= 0 && i < question.options.length) onAnswer(i);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [revealed, question.options.length, onAnswer]);

  return (
    <section className="card">
      <p className="progress">
        Spørsmål {number} av {total} · {question.category} · {score} poeng
        {!revealed && (
          <span className={secondsLeft <= 5 ? "countdown countdown-low" : "countdown"}>{secondsLeft} s</span>
        )}
      </p>
      <h2>{question.text}</h2>

      <div className="options">
        {question.options.map((option, i) => {
          let className = "option";
          if (revealed && i === question.correct) className += " option-correct";
          if (revealed && i === selected && i !== question.correct) className += " option-wrong";
          return (
            <button key={option} className={className} disabled={revealed} onClick={() => onAnswer(i)}>
              <span className="option-key">{i + 1}</span> {option}
            </button>
          );
        })}
      </div>

      {revealed && (
        <div className="reveal">
          <p>{selected === NO_ANSWER ? "Tiden er ute." : selected === question.correct ? "Riktig!" : "Feil svar."}</p>
          <button className="primary" onClick={onNext}>
            {number < total ? "Neste spørsmål" : "Se resultat"}
          </button>
        </div>
      )}
    </section>
  );
}
