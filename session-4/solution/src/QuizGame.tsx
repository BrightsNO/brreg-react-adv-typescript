import { useQuestions } from "./hooks/useQuestions";
import { useQuizStore } from "./stores/quizStore";
import type { Question } from "./types";
import { Message } from "./components/Message";
import { ErrorMessage } from "./components/ErrorMessage";
import { PlayerBar } from "./components/PlayerBar";
import { StartScreen } from "./components/StartScreen";
import { QuestionCard } from "./components/QuestionCard";
import { ResultScreen } from "./components/ResultScreen";

export function QuizGame() {
  const questions = useQuestions();

  // Nivå 1: status fra TanStack Query. Etter de to sjekkene vet TypeScript at status er "success".
  if (questions.status === "pending") return <Message>Laster spørsmål …</Message>;
  if (questions.status === "error") {
    return <ErrorMessage message={questions.error.message} onRetry={() => questions.refetch()} />;
  }

  return (
    <>
      <PlayerBar questions={questions.data} />
      <Game questions={questions.data} />
    </>
  );
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
