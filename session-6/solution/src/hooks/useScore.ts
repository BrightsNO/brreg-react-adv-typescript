import { countCorrect } from "../game/scoring";
import { selectAnswers, useQuizStore } from "../stores/quizStore";
import type { Question } from "../types";

// Poengsummen er en utledet verdi: regnes ut fra spørsmålene og svarene, lagres ikke.
export function useScore(questions: Question[]): number {
  const answers = useQuizStore(selectAnswers);
  return countCorrect(questions, answers);
}
