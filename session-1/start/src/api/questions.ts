// Henter spørsmålene fra mock-backenden.
export async function fetchQuestions(): Promise<any> {
  const res = await fetch("/api/questions");
  if (!res.ok) {
    throw new Error(`Kunne ikke hente spørsmål (${res.status})`);
  }
  return res.json();
}
