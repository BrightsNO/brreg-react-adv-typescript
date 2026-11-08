import { delay, http, HttpResponse } from "msw";
import { questions } from "./data";

// Styr mock-backenden med ?mock=... i adressefeltet:
//   ?mock=slow    svarer etter 2 sekunder
//   ?mock=error   svarer med 500 og en HTML-feilside
//   ?mock=broken  ett av spørsmålene mangler feltet text
function mockMode(): string | null {
  return new URLSearchParams(window.location.search).get("mock");
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
];
