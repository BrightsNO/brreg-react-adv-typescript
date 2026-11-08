import { describe, expect, it } from "vitest";
import { countCorrect, isCorrect } from "./scoring";

const question = {
  id: "q1",
  text: "Hva er 1 + 1?",
  options: ["1", "2", "3"],
  correct: 1,
  category: "web" as const,
};

describe("isCorrect", () => {
  it("gir true for riktig svar", () => {
    expect(isCorrect(question, 1)).toBe(true);
  });

  it("gir false for feil svar", () => {
    expect(isCorrect(question, 0)).toBe(false);
  });
});

describe("countCorrect", () => {
  it("teller riktige svar", () => {
    expect(countCorrect([question, question], [1, 2])).toBe(1);
  });
});
