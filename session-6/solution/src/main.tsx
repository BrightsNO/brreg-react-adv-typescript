import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { createQueryClient } from "./queryClient";
import { reportUncaughtErrors } from "./monitoring";
import { App } from "./App";
import "./index.css";

// TanStack Query er satt opp i src/queryClient.ts, så testene kan bruke det samme oppsettet.
const queryClient = createQueryClient();

// Feil som ingen fanger, rapporteres også (økt 5).
reportUncaughtErrors();

// Starter mock-backenden (MSW) før appen rendres, så de første kallene ikke går til et ekte API.
async function enableMocking() {
  if (!import.meta.env.DEV) return;
  const { worker } = await import("./mocks/browser");
  await worker.start({ onUnhandledRequest: "bypass" });
}

enableMocking().then(() => {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </StrictMode>,
  );
});
