import { screen } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";
import { server } from "./mocks/server";
import { renderWithProviders } from "./test/render";
import { QuizGame } from "./QuizGame";

// Live-demo: komponenttester med Testing Library og mock-backenden.
describe("QuizGame", () => {
  it("viser spørsmålene fra serveren på startskjermen", async () => {
    renderWithProviders(<QuizGame />);

    // findBy venter til elementet finnes. Spørsmålene kommer fra mock-backenden etter litt tid.
    expect(await screen.findByRole("heading", { name: "Klar for quiz?" })).toBeInTheDocument();
    expect(screen.getByText("8 spørsmål i denne runden:")).toBeInTheDocument();
  });

  it("viser «Riktig!» når spilleren svarer riktig", async () => {
    const { user } = renderWithProviders(<QuizGame />);

    await user.click(await screen.findByRole("button", { name: "Start quiz" }));
    expect(screen.getByRole("heading", { name: /Hvilken hook bruker du/ })).toBeInTheDocument();

    // Navnet på knappen er teksten i den: tallet for tasten og svaret.
    await user.click(screen.getByRole("button", { name: "2 useState" }));
    expect(screen.getByText("Riktig!")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Neste spørsmål" })).toBeInTheDocument();
  });

  it("viser en feilmelding når spørsmålene ikke kan hentes", async () => {
    // Bytt ut svaret fra mock-backenden, bare i denne testen. setup.ts fjerner det etter testen.
    server.use(http.get("/api/questions", () => new HttpResponse(null, { status: 500 })));

    renderWithProviders(<QuizGame />);

    expect(await screen.findByText("Kunne ikke hente spørsmål (500)")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Prøv igjen" })).toBeInTheDocument();
  });
});
