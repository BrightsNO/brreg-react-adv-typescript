import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { App } from "./App";
import "./index.css";

// TanStack Query er satt opp her, så du kan bruke useQuery og useMutation hvor som helst i appen.
// retry: 1 betyr ett nytt forsøk ved feil (standard er tre), så feil vises raskere i kurset.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1 },
  },
});

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
