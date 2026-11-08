import { useState } from "react";
import { countCorrect, NO_ANSWER } from "../game/scoring";
import type { GameState, Question } from "../types";

// Ekstra A: all spillogikk samlet i én hook. QuizGame blir nesten bare JSX.
export function useQuiz(questions: Question[]) {
  const [game, setGame] = useState<GameState>({ phase: "lobby" });

  // Utledet verdi: regnes ut på hver rendering, ingen egen state eller effect.
  const answers = game.phase === "lobby" ? [] : game.answers;
  const score = countCorrect(questions, answers);

  function start() {
    setGame({ phase: "question", index: 0, answers: [] });
  }

  function answer(choice: number) {
    if (game.phase !== "question") return;
    setGame({ phase: "reveal", index: game.index, answers: [...game.answers, choice] });
  }

  // Tiden er ute: et svar som aldri kan være riktig.
  function timeout() {
    answer(NO_ANSWER);
  }

  function next() {
    if (game.phase !== "reveal") return;
    if (game.index + 1 < questions.length) {
      setGame({ phase: "question", index: game.index + 1, answers: game.answers });
    } else {
      setGame({ phase: "finished", answers: game.answers });
    }
  }

  return { game, score, start, answer, timeout, next };
}
