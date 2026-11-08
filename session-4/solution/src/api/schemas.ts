import { z } from "zod";
import { CATEGORIES } from "../types";

// Nivå 1: Zod-skjemaer erstatter type guardene vi skrev for hånd i økt 1.
// Skjemaet er både sjekken (ved runtime) og typen (med z.infer).

export const QuestionSchema = z.object({
  id: z.string(),
  text: z.string(),
  options: z.array(z.string()),
  /** Indeksen til riktig svar i options. */
  correct: z.number(),
  category: z.enum(CATEGORIES),
});
export type Question = z.infer<typeof QuestionSchema>;

// Live-demo: skjemaet for en rad i topplista.
export const LeaderboardEntrySchema = z.object({
  name: z.string(),
  score: z.number(),
  total: z.number(),
  playedAt: z.string(),
});
export type LeaderboardEntry = z.infer<typeof LeaderboardEntrySchema>;
