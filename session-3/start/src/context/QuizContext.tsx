import { createContext, useContext, useState, type ReactNode } from "react";
import { useQuiz } from "../hooks/useQuiz";
import type { Question } from "../types";

export type Settings = {
  secondsPerQuestion: number;
  showCategory: boolean;
};

type QuizContextValue = ReturnType<typeof useQuiz> & {
  playerName: string;
  setPlayerName: (name: string) => void;
  settings: Settings;
  setSettings: (settings: Settings) => void;
};

const QuizContext = createContext<QuizContextValue | null>(null);

// Én context for alt: spillet, spillernavnet og innstillingene.
export function QuizProvider({ questions, children }: { questions: Question[]; children: ReactNode }) {
  const quiz = useQuiz(questions);
  const [playerName, setPlayerName] = useState("");
  const [settings, setSettings] = useState<Settings>({ secondsPerQuestion: 20, showCategory: true });

  return (
    <QuizContext.Provider value={{ ...quiz, playerName, setPlayerName, settings, setSettings }}>
      {children}
    </QuizContext.Provider>
  );
}

export function useQuizContext(): QuizContextValue {
  const context = useContext(QuizContext);
  if (!context) throw new Error("useQuizContext må brukes inne i QuizProvider");
  return context;
}
