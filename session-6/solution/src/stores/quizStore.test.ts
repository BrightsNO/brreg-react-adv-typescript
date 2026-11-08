import { beforeEach, describe, expect, it } from "vitest";
import { NO_ANSWER } from "../game/scoring";
import { useQuizStore } from "./quizStore";

// En Zustand-store kan testes uten React: les med getState() og kall handlingene direkte.
describe("quizStore", () => {
  beforeEach(() => {
    useQuizStore.setState({ game: { phase: "lobby" } });
  });

  it("starter på første spørsmål", () => {
    useQuizStore.getState().start();
    expect(useQuizStore.getState().game).toEqual({ phase: "question", index: 0, answers: [] });
  });

  it("viser fasiten etter et svar, og går videre til neste spørsmål", () => {
    const { start, answer, next } = useQuizStore.getState();
    start();
    answer(2);
    expect(useQuizStore.getState().game).toEqual({ phase: "reveal", index: 0, answers: [2] });
    next(3);
    expect(useQuizStore.getState().game).toEqual({ phase: "question", index: 1, answers: [2] });
  });

  it("registrerer tidsavbrudd som NO_ANSWER", () => {
    const { start, timeout } = useQuizStore.getState();
    start();
    timeout();
    expect(useQuizStore.getState().game).toEqual({ phase: "reveal", index: 0, answers: [NO_ANSWER] });
  });

  it("ignorerer svar når fasiten allerede vises", () => {
    const { start, answer } = useQuizStore.getState();
    start();
    answer(1);
    answer(2);
    expect(useQuizStore.getState().game).toEqual({ phase: "reveal", index: 0, answers: [1] });
  });

  it("avslutter etter siste spørsmål", () => {
    const { start, answer, next } = useQuizStore.getState();
    start();
    answer(0);
    next(1);
    expect(useQuizStore.getState().game).toEqual({ phase: "finished", answers: [0] });
  });
});
