import { describe, expect, it } from "vitest";
import { countCorrect, groupBy, isCorrect, scoreByCategory } from "./scoring";
import type { Question } from "../types";

const q1: Question = { id: "q1", text: "Hva er 1 + 1?", options: ["1", "2", "3"], correct: 1, category: "web" };
const q2: Question = { id: "q2", text: "Hva er unknown?", options: ["En type", "En hook"], correct: 0, category: "typescript" };

describe("isCorrect", () => {
  it("gir true for riktig svar", () => {
    expect(isCorrect(q1, 1)).toBe(true);
  });

  it("gir false for feil svar", () => {
    expect(isCorrect(q1, 0)).toBe(false);
  });
});

describe("countCorrect", () => {
  it("teller riktige svar", () => {
    expect(countCorrect([q1, q2], [1, 1])).toBe(1);
  });
});

describe("scoreByCategory", () => {
  it("gir poeng per kategori, også for kategorier uten spørsmål", () => {
    expect(scoreByCategory([q1, q2], [1, 1])).toEqual({
      react: { correct: 0, total: 0 },
      typescript: { correct: 0, total: 1 },
      web: { correct: 1, total: 1 },
    });
  });
});

describe("groupBy", () => {
  it("grupperer på en nøkkel", () => {
    const groups = groupBy([q1, q2], "category");
    expect(groups.get("web")).toEqual([q1]);
    expect(groups.get("typescript")).toEqual([q2]);
  });
});
