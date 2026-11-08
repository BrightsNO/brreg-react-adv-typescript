// ---------- Nivå 1: typene for spørsmålene ----------

// Ekstra A: kategoriene er en verdi i koden. Typen lages fra den samme listen,
// så de aldri kommer ut av sync.
export const CATEGORIES = ["react", "typescript", "web"] as const;
export type Category = (typeof CATEGORIES)[number]; // "react" | "typescript" | "web"

export type Question = {
  id: string;
  text: string;
  options: string[];
  /** Indeksen til riktig svar i options. */
  correct: number;
  category: Category;
};

// ---------- Live-demo: lastetilstanden ----------

export type LoadState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: string };

// ---------- Nivå 2: spilltilstanden ----------

export type GameState =
  | { phase: "lobby" }
  | { phase: "question"; index: number; answers: number[] }
  | { phase: "reveal"; index: number; answers: number[] }
  | { phase: "finished"; answers: number[] };

// ---------- Ekstra A: poeng per kategori ----------

// Mapped type: ett felt per kategori. Legger noen til en ny kategori i CATEGORIES,
// krever TypeScript at alle objekter av denne typen får et felt for den.
export type ScoreByCategory = { [C in Category]: { correct: number; total: number } };
