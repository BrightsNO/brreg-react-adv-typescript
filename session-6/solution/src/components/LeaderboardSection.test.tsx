import { screen, within } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";
import { server } from "../mocks/server";
import { renderWithProviders } from "../test/render";
import { LeaderboardSection } from "./LeaderboardSection";

// Nivå 1: topplista, med lasting, data og feil.
describe("LeaderboardSection", () => {
  it("viser at topplista lastes", () => {
    renderWithProviders(<LeaderboardSection />);

    // getBy: teksten skal finnes med en gang, før svaret fra serveren er kommet.
    expect(screen.getByText("Laster topplista …")).toBeInTheDocument();
  });

  it("viser resultatene fra serveren", async () => {
    renderWithProviders(<LeaderboardSection />);

    const list = await screen.findByRole("list", { name: "Toppliste" });
    expect(within(list).getAllByRole("listitem")).toHaveLength(3);
    expect(within(list).getByText("Ada")).toBeInTheDocument();

    // queryBy gir null i stedet for å kaste en feil. Bruk den når du vil sjekke at noe IKKE finnes.
    expect(screen.queryByText("Laster topplista …")).not.toBeInTheDocument();
  });

  it("viser en feilmelding når topplista ikke kan hentes", async () => {
    server.use(http.get("/api/leaderboard", () => HttpResponse.json(null, { status: 500 })));

    renderWithProviders(<LeaderboardSection />);

    // Feilmeldinger i terminalen er forventet her: React og reportError logger feilen. Testen er grønn.
    expect(await screen.findByText("Topplista er ikke tilgjengelig akkurat nå.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Prøv igjen" })).toBeInTheDocument();
  });

  it("henter topplista på nytt når du trykker «Prøv igjen»", async () => {
    // once: true gjør at bare det første kallet feiler. Neste kall får det vanlige svaret.
    server.use(http.get("/api/leaderboard", () => HttpResponse.json(null, { status: 500 }), { once: true }));

    const { user } = renderWithProviders(<LeaderboardSection />);

    await user.click(await screen.findByRole("button", { name: "Prøv igjen" }));
    expect(await screen.findByRole("list", { name: "Toppliste" })).toBeInTheDocument();
  });
});
