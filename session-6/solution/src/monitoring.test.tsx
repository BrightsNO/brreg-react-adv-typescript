import { screen, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";
import { server } from "./mocks/server";
import { renderWithProviders } from "./test/render";
import { LeaderboardSection } from "./components/LeaderboardSection";

// Ekstra A: test at feilrapporteringen fra økt 5 virker.
describe("feilrapportering", () => {
  it("rapporterer feilen når topplista ikke kan hentes", async () => {
    // Ta vare på rapportene som sendes til mock-backenden, så testen kan sjekke dem.
    const reports: unknown[] = [];
    server.use(
      http.get("/api/leaderboard", () => HttpResponse.json(null, { status: 500 })),
      http.post("/api/errors", async ({ request }) => {
        reports.push(await request.json());
        return new HttpResponse(null, { status: 204 });
      }),
    );

    renderWithProviders(<LeaderboardSection />);
    await screen.findByText("Topplista er ikke tilgjengelig akkurat nå.");

    // Rapporten sendes litt etter at feilen vises, så vi venter på den med waitFor.
    await waitFor(() =>
      expect(reports).toContainEqual(
        expect.objectContaining({
          message: "Kunne ikke hente topplista (500)",
          context: expect.objectContaining({ kilde: "query" }),
        }),
      ),
    );

    // Testen viser også det vi diskuterte i økt 5: feilen rapporteres to ganger,
    // én gang fra QueryCache og én gang fra Error Boundary-en.
    await waitFor(() =>
      expect(reports).toContainEqual(
        expect.objectContaining({ context: expect.objectContaining({ kilde: "error-boundary" }) }),
      ),
    );
  });
});
