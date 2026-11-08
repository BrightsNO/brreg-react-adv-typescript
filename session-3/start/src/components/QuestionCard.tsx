import { useEffect } from "react";
import { useCountdown } from "../hooks/useCountdown";
import { useQuizContext } from "../context/QuizContext";
import { NO_ANSWER } from "../game/scoring";
import type { Question } from "../types";

type Props = {
  question: Question;
  number: number;
  total: number;
  /** Svaret spilleren valgte, eller null hvis svaret ikke skal vises ennå. */
  selected: number | null;
};

export function QuestionCard({ question, number, total, selected }: Props) {
  const { settings, answer, timeout, next } = useQuizContext();
  const revealed = selected !== null;
  const secondsLeft = useCountdown(settings.secondsPerQuestion, timeout);

  // Svar med tastene 1–4.
  useEffect(() => {
    if (revealed) return;
    function onKeyDown(e: KeyboardEvent) {
      const i = Number(e.key) - 1;
      if (i >= 0 && i < question.options.length) answer(i);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [revealed, question.options.length, answer]);

  return (
    <section className="card">
      <p className="progress">
        Spørsmål {number} av {total}
        {settings.showCategory && ` · ${question.category}`}
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
            <button key={option} className={className} disabled={revealed} onClick={() => answer(i)}>
              <span className="option-key">{i + 1}</span> {option}
            </button>
          );
        })}
      </div>

      {revealed && (
        <div className="reveal">
          <p>{selected === NO_ANSWER ? "Tiden er ute." : selected === question.correct ? "Riktig!" : "Feil svar."}</p>
          <button className="primary" onClick={next}>
            {number < total ? "Neste spørsmål" : "Se resultat"}
          </button>
        </div>
      )}
    </section>
  );
}
