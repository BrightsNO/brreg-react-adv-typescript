import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterAll, afterEach, beforeAll, beforeEach } from "vitest";
import { server } from "../mocks/server";
import { usePlayerStore } from "../stores/playerStore";
import { useQuizStore } from "../stores/quizStore";
import { useSettingsStore } from "../stores/settingsStore";

// Denne filen kjøres før testene (se setupFiles i vite.config.ts).
// Linjen øverst gir deg matchere som toBeInTheDocument() og toBeDisabled().

// 1. Start mock-backenden før alle testene, og stopp den til slutt.
//    onUnhandledRequest: "error" gjør at testen feiler hvis appen kaller et endepunkt som ikke finnes i handlers.ts.
beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterAll(() => server.close());

// 2. Før hver test: nullstill storene. Zustand-storer er globale (økt 3),
//    så uten dette ville en test starte der den forrige sluttet.
beforeEach(() => {
  useQuizStore.setState({ game: { phase: "lobby" } });
  usePlayerStore.setState({ name: "" });
  useSettingsStore.setState({ secondsPerQuestion: 20, showCategory: true });
});

// 3. Etter hver test: fjern det som ble rendret, og fjern handlers som en test har lagt til med server.use(...).
afterEach(() => {
  cleanup();
  server.resetHandlers();
});
