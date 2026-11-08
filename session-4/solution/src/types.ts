// ---------- Spørsmål ----------

// Kategoriene er en verdi i koden. Typen lages fra den samme listen,
// så de aldri kommer ut av sync.
export const CATEGORIES = ["react", "typescript", "web"] as const;
export type Category = (typeof CATEGORIES)[number]; // "react" | "typescript" | "web"

// Nivå 1: typen lages fra Zod-skjemaet, så skjemaet og typen aldri kommer ut av sync.
export type { Question, LeaderboardEntry } from "./api/schemas";

// ---------- Lastetilstand ----------

export type LoadState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: string };

// ---------- Spilltilstand ----------

export type GameState =
  | { phase: "lobby" }
  | { phase: "question"; index: number; answers: number[] }
  | { phase: "reveal"; index: number; answers: number[] }
  | { phase: "finished"; answers: number[] };

// ---------- Poeng per kategori ----------

// Mapped type: ett felt per kategori. Legger noen til en ny kategori i CATEGORIES,
// krever TypeScript at alle objekter av denne typen får et felt for den.
export type ScoreByCategory = { [C in Category]: { correct: number; total: number } };
