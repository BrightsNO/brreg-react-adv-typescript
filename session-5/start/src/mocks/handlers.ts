import { delay, http, HttpResponse } from "msw";
import { questions } from "./data";

// Styr mock-backenden med ?mock=... i adressefeltet:
//   ?mock=slow                spørsmålene kommer etter 2 sekunder
//   ?mock=error               spørsmålene: 500 og en HTML-feilside
//   ?mock=broken              ett av spørsmålene mangler feltet text
//   ?mock=leaderboard-slow    topplista kommer etter 2 sekunder
//   ?mock=leaderboard-error   topplista: 500-feil
//   ?mock=leaderboard-broken  én rad i topplista har score som tekst
function mockMode(): string | null {
  return new URLSearchParams(window.location.search).get("mock");
}

// Topplista lever i minnet til siden lastes på nytt.
const leaderboard: { name: string; score: number; total: number; playedAt: string }[] = [
  { name: "Ada", score: 8, total: 8, playedAt: "2026-10-01T10:00:00.000Z" },
  { name: "Linus", score: 6, total: 8, playedAt: "2026-10-01T10:05:00.000Z" },
  { name: "Grace", score: 5, total: 8, playedAt: "2026-10-01T10:10:00.000Z" },
];

function isResultBody(x: unknown): x is { name: string; score: number; total: number } {
  return (
    typeof x === "object" && x !== null &&
    "name" in x && typeof x.name === "string" &&
    "score" in x && typeof x.score === "number" &&
    "total" in x && typeof x.total === "number"
  );
}

function topTen() {
  return [...leaderboard].sort((a, b) => b.score - a.score).slice(0, 10);
}

export const handlers = [
  http.get("/api/questions", async () => {
    const mode = mockMode();
    await delay(mode === "slow" ? 2000 : 300);

    if (mode === "error") {
      return new HttpResponse("<h1>500 Internal Server Error</h1>", {
        status: 500,
        headers: { "Content-Type": "text/html" },
      });
    }

    if (mode === "broken") {
      const broken = questions.map((q, i) =>
        i === 1 ? Object.fromEntries(Object.entries(q).filter(([key]) => key !== "text")) : q,
      );
      return HttpResponse.json(broken);
    }

    return HttpResponse.json(questions);
  }),

  http.get("/api/leaderboard", async () => {
    const mode = mockMode();
    await delay(mode === "leaderboard-slow" ? 2000 : 300);

    if (mode === "leaderboard-error") {
      return HttpResponse.json({ error: "Topplista er ikke tilgjengelig" }, { status: 500 });
    }

    if (mode === "leaderboard-broken") {
      return HttpResponse.json(topTen().map((e, i) => (i === 0 ? { ...e, score: "åtte" } : e)));
    }

    return HttpResponse.json(topTen());
  }),

  // Tar imot feilrapporter når APM ikke er satt opp (se src/monitoring.ts i nivå 2).
  http.post("/api/errors", async ({ request }) => {
    const report: unknown = await request.json();
    console.info("[mock-backend] feilrapport mottatt:", report);
    return new HttpResponse(null, { status: 204 });
  }),

  http.post("/api/results", async ({ request }) => {
    await delay(500);
    const body: unknown = await request.json();
    if (!isResultBody(body)) {
      return HttpResponse.json({ error: "Ugyldig resultat" }, { status: 400 });
    }
    const entry = { name: body.name || "Gjest", score: body.score, total: body.total, playedAt: new Date().toISOString() };
    leaderboard.push(entry);
    return HttpResponse.json(entry, { status: 201 });
  }),
];
