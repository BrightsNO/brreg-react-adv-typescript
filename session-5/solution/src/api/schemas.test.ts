import { describe, expect, it } from "vitest";
import { z } from "zod";
import { LeaderboardEntrySchema, QuestionSchema } from "./schemas";

const valid = { id: "q1", text: "Hva er 1 + 1?", options: ["1", "2"], correct: 1, category: "web" };

describe("QuestionSchema", () => {
  it("godtar et gyldig spørsmål", () => {
    expect(QuestionSchema.safeParse(valid).success).toBe(true);
  });

  it("avviser et spørsmål uten text", () => {
    const withoutText = { id: valid.id, options: valid.options, correct: valid.correct, category: valid.category };
    expect(QuestionSchema.safeParse(withoutText).success).toBe(false);
  });

  it("avviser en ukjent kategori", () => {
    expect(QuestionSchema.safeParse({ ...valid, category: "css" }).success).toBe(false);
  });

  it("avviser en liste der ett spørsmål er ugyldig", () => {
    expect(z.array(QuestionSchema).safeParse([valid, { ...valid, correct: "1" }]).success).toBe(false);
  });
});

describe("LeaderboardEntrySchema", () => {
  it("avviser score som tekst", () => {
    const entry = { name: "Ada", score: "åtte", total: 8, playedAt: "2026-10-01T10:00:00.000Z" };
    expect(LeaderboardEntrySchema.safeParse(entry).success).toBe(false);
  });
});
