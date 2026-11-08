import type { Question } from "../types";
import { isQuestionList } from "./guards";

// Henter spørsmålene fra mock-backenden.
export async function fetchQuestions(): Promise<Question[]> {
  const res = await fetch("/api/questions");
  if (!res.ok) {
    throw new Error(`Kunne ikke hente spørsmål (${res.status})`);
  }

  // unknown i stedet for any: vi får ikke bruke dataene før de er sjekket.
  const data: unknown = await res.json();
  if (!isQuestionList(data)) {
    throw new Error("Svaret fra API-et hadde ikke formen vi forventet");
  }
  return data;
}
