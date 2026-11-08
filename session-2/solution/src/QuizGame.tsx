import { useQuestions } from "./hooks/useQuestions";
import { useQuiz } from "./hooks/useQuiz";
import type { Question } from "./types";
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
  // Ekstra A: spillogikken ligger i useQuiz.
  const { game, score, start, answer, timeout, next } = useQuiz(questions);

  switch (game.phase) {
    case "lobby":
      return <StartScreen questions={questions} onStart={start} />;
    case "question":
    case "reveal":
      return (
        <QuestionCard
          // Live-demo, steg 3: ny key gir ny komponent, og dermed ny nedtelling per spørsmål.
          key={questions[game.index].id}
          question={questions[game.index]}
          number={game.index + 1}
          total={questions.length}
          score={score}
          selected={game.phase === "reveal" ? game.answers[game.index] : null}
          onAnswer={answer}
          onTimeout={timeout}
          onNext={next}
        />
      );
    case "finished":
      return <ResultScreen questions={questions} answers={game.answers} onRestart={start} />;
    default: {
      const unhandled: never = game;
      return unhandled;
    }
  }
}
