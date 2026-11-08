import { useState } from "react";
import { useQuestions } from "./hooks/useQuestions";
import type { GameState, Question } from "./types";
import { Message } from "./components/Message";
import { StartScreen } from "./components/StartScreen";
import { QuestionCard } from "./components/QuestionCard";
import { ResultScreen } from "./components/ResultScreen";

export function QuizGame() {
  const questions = useQuestions();

  switch (questions.status) {
    case "idle":
    case "loading":
      return <Message>Laster spørsmål …</Message>;
    case "error":
      return <Message tone="error">{questions.error}</Message>;
    case "success":
      return <Game questions={questions.data} />;
    default: {
      const unhandled: never = questions;
      return unhandled;
    }
  }
}

function Game({ questions }: { questions: Question[] }) {
  const [game, setGame] = useState<GameState>({ phase: "lobby" });

  function start() {
    setGame({ phase: "question", index: 0, answers: [] });
  }

  function answer(choice: number) {
    if (game.phase !== "question") return;
    setGame({ phase: "reveal", index: game.index, answers: [...game.answers, choice] });
  }

  function next() {
    if (game.phase !== "reveal") return;
    if (game.index + 1 < questions.length) {
      setGame({ phase: "question", index: game.index + 1, answers: game.answers });
    } else {
      setGame({ phase: "finished", answers: game.answers });
    }
  }

  switch (game.phase) {
    case "lobby":
      return <StartScreen questions={questions} onStart={start} />;
    case "question":
    case "reveal":
      return (
        <QuestionCard
          question={questions[game.index]}
          number={game.index + 1}
          total={questions.length}
          selected={game.phase === "reveal" ? game.answers[game.index] : null}
          onAnswer={answer}
          onNext={next}
        />
      );
    case "finished":
      return (
        <ResultScreen questions={questions} answers={game.answers} onRestart={start} />
      );
    default: {
      const unhandled: never = game;
      return unhandled;
    }
  }
}
