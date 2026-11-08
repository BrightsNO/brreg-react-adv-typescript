import { useQuestions } from "./hooks/useQuestions";
import { useQuizStore } from "./stores/quizStore";
import type { Question } from "./types";
import { Message } from "./components/Message";
import { PlayerBar } from "./components/PlayerBar";
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
      return (
        // Nivå 2: ingen provider lenger. Storen kan brukes direkte der den trengs.
        <>
          <PlayerBar questions={questions.data} />
          <Game questions={questions.data} />
        </>
      );
    default: {
      const unhandled: never = questions;
      return unhandled;
    }
  }
}

function Game({ questions }: { questions: Question[] }) {
  const game = useQuizStore((s) => s.game);

  switch (game.phase) {
    case "lobby":
      return <StartScreen questions={questions} />;
    case "question":
    case "reveal":
      return (
        <QuestionCard
          key={questions[game.index].id}
          question={questions[game.index]}
          number={game.index + 1}
          total={questions.length}
          selected={game.phase === "reveal" ? game.answers[game.index] : null}
        />
      );
    case "finished":
      return <ResultScreen questions={questions} answers={game.answers} />;
    default: {
      const unhandled: never = game;
      return unhandled;
    }
  }
}
