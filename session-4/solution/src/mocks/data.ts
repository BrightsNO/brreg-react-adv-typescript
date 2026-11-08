import type { Question } from "../types";

// Spørsmålsbanken som mock-backenden svarer med på GET /api/questions.
export const questions = [
  {
    id: "q1",
    text: "Hvilken hook bruker du for å lagre en verdi som skal gi ny rendering når den endres?",
    options: ["useRef", "useState", "useMemo", "useId"],
    correct: 1,
    category: "react",
  },
  {
    id: "q2",
    text: "Hva skjer med TypeScript-typene når Vite bygger appen?",
    options: ["De sjekkes i nettleseren", "De blir til JSDoc", "De fjernes", "De blir til Zod-skjemaer"],
    correct: 2,
    category: "typescript",
  },
  {
    id: "q3",
    text: "Hva returnerer res.json() i en fetch?",
    options: ["Promise<unknown>", "Promise<any>", "Promise<object>", "Promise<string>"],
    correct: 1,
    category: "typescript",
  },
  {
    id: "q4",
    text: "Hvilken type bør du bruke for data du ikke vet hvordan ser ut ennå?",
    options: ["any", "object", "unknown", "never"],
    correct: 2,
    category: "typescript",
  },
  {
    id: "q5",
    text: "Hva gjør Omit<Question, \"correct\">?",
    options: [
      "Lager en type uten feltet correct",
      "Gjør correct valgfritt",
      "Fjerner spørsmål som er feil",
      "Gjør alle felt readonly",
    ],
    correct: 0,
    category: "typescript",
  },
  {
    id: "q6",
    text: "Hvorfor trenger hvert element i en liste en key i React?",
    options: [
      "For at CSS skal virke",
      "For at React skal vite hvilket element som er hvilket mellom renderinger",
      "For at elementet skal bli klikkbart",
      "Det trengs bare i TypeScript",
    ],
    correct: 1,
    category: "react",
  },
  {
    id: "q7",
    text: "Hvilken HTTP-statuskode betyr «Not Found»?",
    options: ["200", "301", "404", "500"],
    correct: 2,
    category: "web",
  },
  {
    id: "q8",
    text: "Hvilket nettleser-API lar deg avbryte en fetch som ikke trengs lenger?",
    options: ["AbortController", "History API", "structuredClone", "IntersectionObserver"],
    correct: 0,
    category: "web",
  },
] satisfies Question[];
