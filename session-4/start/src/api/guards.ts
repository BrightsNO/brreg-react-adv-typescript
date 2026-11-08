import { CATEGORIES, type Category, type Question } from "../types";

// Type guards: sjekker dataene ved runtime og forteller TypeScript hva vi har funnet ut.
// TypeScript stoler blindt på «x is Question», så sjekken må faktisk være riktig.

function isRecord(x: unknown): x is Record<string, unknown> {
  return typeof x === "object" && x !== null;
}

function isCategory(x: unknown): x is Category {
  return typeof x === "string" && (CATEGORIES as readonly string[]).includes(x);
}

export function isQuestion(x: unknown): x is Question {
  return (
    isRecord(x) &&
    typeof x.id === "string" &&
    typeof x.text === "string" &&
    Array.isArray(x.options) &&
    x.options.every((o) => typeof o === "string") &&
    typeof x.correct === "number" &&
    isCategory(x.category)
  );
}

export function isQuestionList(x: unknown): x is Question[] {
  return Array.isArray(x) && x.every(isQuestion);
}
