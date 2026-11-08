import type { Question, ScoreByCategory } from "../types";

// Ren spillogikk, uten React. Lett å teste (se scoring.test.ts).

/** Nivå 2: brukes som svar når tiden går ut. Er aldri en gyldig indeks i options. */
export const NO_ANSWER = -1;

export function isCorrect(question: Question, answerIndex: number): boolean {
  return question.correct === answerIndex;
}

export function countCorrect(questions: Question[], answers: number[]): number {
  return questions.filter((q, i) => isCorrect(q, answers[i])).length;
}

// Generisk groupBy. K må være en nøkkel i T.
export function groupBy<T, K extends keyof T>(items: T[], key: K): Map<T[K], T[]> {
  const groups = new Map<T[K], T[]>();
  for (const item of items) {
    const group = groups.get(item[key]) ?? [];
    group.push(item);
    groups.set(item[key], group);
  }
  return groups;
}

// Poeng per kategori. Returtypen er en mapped type, så alle kategorier må være med.
export function scoreByCategory(questions: Question[], answers: number[]): ScoreByCategory {
  // Uten as: glemmer du en kategori her, gir TypeScript feil.
  const result: ScoreByCategory = {
    react: { correct: 0, total: 0 },
    typescript: { correct: 0, total: 0 },
    web: { correct: 0, total: 0 },
  };
  questions.forEach((q, i) => {
    result[q.category].total += 1;
    if (isCorrect(q, answers[i])) result[q.category].correct += 1;
  });
  return result;
}

// Nivå 1: lengste rekke med riktige svar på rad. Regnes ut fra svarene, så det trengs ingen egen state.
export function longestStreak(questions: Question[], answers: number[]): number {
  let longest = 0;
  let current = 0;
  questions.forEach((q, i) => {
    current = isCorrect(q, answers[i]) ? current + 1 : 0;
    longest = Math.max(longest, current);
  });
  return longest;
}
