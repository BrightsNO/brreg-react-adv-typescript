import { create } from "zustand";
import { NO_ANSWER } from "../game/scoring";
import type { GameState } from "../types";

// Spilltilstanden.
// Spørsmålene ligger IKKE her. De kommer fra serveren og hører hjemme i useQuestions
// (og i TanStack Query i økt 4). Storen holder bare state som finnes i nettleseren.
type QuizStore = {
  game: GameState;
  start: () => void;
  answer: (choice: number) => void;
  timeout: () => void;
  next: (totalQuestions: number) => void;
};

export const useQuizStore = create<QuizStore>()((set, get) => ({
  game: { phase: "lobby" },

  start: () => set({ game: { phase: "question", index: 0, answers: [] } }),

  answer: (choice) => {
    const { game } = get();
    if (game.phase !== "question") return;
    set({ game: { phase: "reveal", index: game.index, answers: [...game.answers, choice] } });
  },

  timeout: () => get().answer(NO_ANSWER),

  next: (totalQuestions) => {
    const { game } = get();
    if (game.phase !== "reveal") return;
    if (game.index + 1 < totalQuestions) {
      set({ game: { phase: "question", index: game.index + 1, answers: game.answers } });
    } else {
      set({ game: { phase: "finished", answers: game.answers } });
    }
  },
}));

// Selector: svarene så langt. Returnerer alltid samme tomme liste i lobbyen, så
// komponenter som bruker den, ikke rendres på nytt uten grunn.
const NO_ANSWERS: number[] = [];
export function selectAnswers(s: QuizStore): number[] {
  return s.game.phase === "lobby" ? NO_ANSWERS : s.game.answers;
}
