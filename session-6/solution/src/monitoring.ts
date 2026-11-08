import { init as initApm } from "@elastic/apm-rum";
import { usePlayerStore } from "./stores/playerStore";

// Ett sted for feilrapportering (økt 5).
// Er VITE_APM_SERVER_URL satt, sendes feilene til Elastic APM. Ellers logges de til konsollen
// og sendes til mock-backenden (POST /api/errors), så du kan se dem i Network-fanen.

const serverUrl = import.meta.env.VITE_APM_SERVER_URL;

const apm = serverUrl
  ? initApm({
      serviceName: "quiz",
      serverUrl,
      serviceVersion: import.meta.env.VITE_APP_VERSION,
      environment: import.meta.env.MODE,
    })
  : null;

export function reportError(error: unknown, context: Record<string, string> = {}): void {
  const err = error instanceof Error ? error : new Error(String(error));

  // Mer kontekst i hver rapport. Vi sender ikke selve spillernavnet, for det er en personopplysning.
  const fullContext = {
    ...context,
    versjon: import.meta.env.VITE_APP_VERSION,
    miljø: import.meta.env.MODE,
    side: window.location.pathname + window.location.search,
    harSpillernavn: usePlayerStore.getState().name ? "ja" : "nei",
  };

  if (apm) {
    apm.addLabels(fullContext);
    apm.captureError(err);
    return;
  }

  console.error("[feilrapport]", err.message, fullContext);
  fetch("/api/errors", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: err.message, context: fullContext }),
  }).catch(() => {
    // Feiler selve rapporten, gir vi opp. Ellers blir den en ny ufanget feil, og vi får en evig løkke.
  });
}

// Feil som ingen fanger, for eksempel i en onClick eller en setTimeout.
// APM-agenten lytter på disse selv. Uten agenten må vi gjøre det, ellers ser vi dem aldri.
export function reportUncaughtErrors(): void {
  if (apm) return;
  window.addEventListener("error", (event) => reportError(event.error ?? event.message, { kilde: "ufanget" }));
  window.addEventListener("unhandledrejection", (event) => reportError(event.reason, { kilde: "ufanget-promise" }));
}
