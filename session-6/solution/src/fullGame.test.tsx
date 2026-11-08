import { screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { questions } from "./mocks/data";
import { renderWithProviders } from "./test/render";
import { QuizGame } from "./QuizGame";

// Nivå 2: spill hele quizen, slik en bruker ville gjort, og lagre resultatet.
describe("hele spillet", () => {
  it("spiller hele quizen og lagrer resultatet i topplista", async () => {
    const { user } = renderWithProviders(<QuizGame />);

    await user.type(await screen.findByLabelText("Navnet ditt"), "Testesen");
    await user.click(screen.getByRole("button", { name: "Start quiz" }));

    // Svar riktig på alle spørsmålene. Fasiten hentes fra de samme dataene som mock-backenden bruker.
    for (const [i, question] of questions.entries()) {
      const correct = question.options[question.correct];
      await user.click(screen.getByRole("button", { name: `${question.correct + 1} ${correct}` }));
      const isLast = i === questions.length - 1;
      await user.click(screen.getByRole("button", { name: isLast ? "Se resultat" : "Neste spørsmål" }));
    }

    expect(screen.getByRole("heading", { name: "Ferdig, Testesen!" })).toBeInTheDocument();
    expect(screen.getByText(`${questions.length} av ${questions.length} riktige`)).toBeInTheDocument();
    expect(screen.getByText(`Lengste rekke: ${questions.length} riktige på rad`)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Lagre resultatet" }));
    expect(await screen.findByText("Resultatet er lagret.")).toBeInTheDocument();

    // Navnet står også øverst i spillet, så vi leter bare inne i topplista.
    const list = await screen.findByRole("list", { name: "Toppliste" });
    expect(await within(list).findByText("Testesen")).toBeInTheDocument();
  });
});
