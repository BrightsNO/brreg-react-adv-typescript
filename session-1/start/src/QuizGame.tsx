import { useState } from "react";
import { useQuestions } from "./hooks/useQuestions";
import { countCorrect } from "./game/scoring";
import { Message } from "./components/Message";
import { StartScreen } from "./components/StartScreen";
import { QuestionCard } from "./components/QuestionCard";
import { ResultScreen } from "./components/ResultScreen";

export function QuizGame() {
  const { isLoading, error, data } = useQuestions();

  // Nivå 2: disse verdiene beskriver til sammen hvor i spillet vi er.
  // Hvilke kombinasjoner gir mening, og hvilke gjør det ikke?
  const [isPlaying, setIsPlaying] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);

  if (isLoading) return <Message>Laster spørsmål …</Message>;
  if (error) return <Message tone="error">{error}</Message>;
  if (!data) return null;

  const questions = data;

  function start() {
    setIsPlaying(true);
    setIsFinished(false);
    setShowAnswer(false);
    setIndex(0);
    setAnswers([]);
  }

  function answer(choice: number) {
    if (showAnswer) return;
    setAnswers([...answers, choice]);
    setShowAnswer(true);
  }

  function next() {
    setShowAnswer(false);
    if (index + 1 < questions.length) {
      setIndex(index + 1);
    } else {
      setIsPlaying(false);
      setIsFinished(true);
    }
  }

  if (isFinished) {
    return <ResultScreen score={countCorrect(questions, answers)} total={questions.length} onRestart={start} />;
  }

  if (!isPlaying) {
    return <StartScreen questions={questions} onStart={start} />;
  }

  return (
    <QuestionCard
      question={questions[index]}
      number={index + 1}
      total={questions.length}
      selected={showAnswer ? answers[index] : null}
      onAnswer={answer}
      onNext={next}
    />
  );
}
