import { z } from "zod";
import { LeaderboardEntrySchema, type LeaderboardEntry } from "./schemas";

// Henter topplista.
export async function fetchLeaderboard(): Promise<LeaderboardEntry[]> {
  const res = await fetch("/api/leaderboard");
  if (!res.ok) {
    throw new Error(`Kunne ikke hente topplista (${res.status})`);
  }
  const result = z.array(LeaderboardEntrySchema).safeParse(await res.json());
  if (!result.success) {
    console.error(z.prettifyError(result.error));
    throw new Error("Topplista hadde ikke formen vi forventet");
  }
  return result.data;
}

export type NewResult = { name: string; score: number; total: number };

// Sender et resultat til serveren.
export async function postResult(result: NewResult): Promise<LeaderboardEntry> {
  const res = await fetch("/api/results", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(result),
  });
  if (!res.ok) {
    throw new Error(`Kunne ikke lagre resultatet (${res.status})`);
  }
  return LeaderboardEntrySchema.parse(await res.json());
}
