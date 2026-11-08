// Ren spillogikk, uten React. Lett å teste (se scoring.test.ts).

export function isCorrect(question: any, answerIndex: number): boolean {
  return question.correct === answerIndex;
}

export function countCorrect(questions: any[], answers: number[]): number {
  return questions.filter((q, i) => isCorrect(q, answers[i])).length;
}
