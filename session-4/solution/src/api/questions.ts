import { z } from "zod";
import { QuestionSchema, type Question } from "./schemas";

// Henter spørsmålene fra mock-backenden.
// queryFn i TanStack Query må kaste en feil når noe går galt. Da blir status "error".
export async function fetchQuestions(): Promise<Question[]> {
  const res = await fetch("/api/questions");
  if (!res.ok) {
    throw new Error(`Kunne ikke hente spørsmål (${res.status})`);
  }

  // Nivå 1: Zod sjekker at svaret har riktig form.
  const result = z.array(QuestionSchema).safeParse(await res.json());
  if (!result.success) {
    console.error(z.prettifyError(result.error));
    throw new Error("Svaret fra API-et hadde ikke formen vi forventet");
  }
  return result.data;
}
