# Økt 4: Data fra serveren – oppgaver

Du har 90 minutter. Det er to nivåer, og to ekstraoppgaver for dem som blir ferdige. Alle starter på nivå 1. Det er helt greit å bare bli ferdig med nivå 1.

`session-4/start` bygger på løsningen fra økt 3. TanStack Query er satt opp i `src/main.tsx`, og `zod` og `react-error-boundary` er installert. Topplista har ferdig UI (`Leaderboard.tsx`), og mock-backenden har to nye endepunkter.

| Tid | Hva |
| --- | --- |
| 0–10 min | Kom i gang: start prosjektet og les oppgaven |
| 10–45 min | Nivå 1 |
| 45–80 min | Nivå 2, og ekstraoppgavene hvis du har tid |
| 80–90 min | Felles oppsummering |

## Kom i gang

```bash
cd session-4/start
npm install
npm run dev
```

Sjekk arbeidet ditt med `npm run typecheck`, `npm run lint` og `npm test`. Cheatsheetet ligger i `session-4/cheatsheet.md`.

Mock-backenden styres fra adressen:

| Adresse | Hva skjer |
| --- | --- |
| `?mock=slow` | Spørsmålene kommer etter 2 sekunder |
| `?mock=error` | Spørsmålene: 500-feil |
| `?mock=broken` | Ett spørsmål mangler feltet `text` |
| `?mock=leaderboard-slow` | Topplista kommer etter 2 sekunder |
| `?mock=leaderboard-error` | Topplista: 500-feil |
| `?mock=leaderboard-broken` | Én rad i topplista har `score` som tekst |

| Endepunkt | Hva det gjør |
| --- | --- |
| `GET /api/leaderboard` | Gir de ti beste resultatene: `{ name, score, total, playedAt }[]` |
| `POST /api/results` | Lagrer et resultat. Body: `{ name, score, total }`. Svarer med den lagrede raden. |

Mock-backenden ligger i `src/mocks/handlers.ts`. Du kan endre den og legge til egne endepunkter.

## Står du fast?

1. Les «Ferdig når» på nytt.
2. Åpne hintet for det du står fast på. Det gir deg retningen.
3. Står du fortsatt fast, åpne «Vis koden» inne i hintet.
4. Se i `session-4/solution`.

Det er helt greit å jobbe to og to.

---

## Nivå 1 – Spørsmålene med Zod og TanStack Query

**Mål:** Spørsmålene valideres med et Zod-skjema og hentes med `useQuery`, i stedet for type guarden og hooken vi skrev selv.

**Hvorfor:** Type guarden og typen kunne komme ut av sync. Med Zod er skjemaet både sjekken og typen. Og TanStack Query gir deg lasting, feil, nytt forsøk og cache, som vår egen hook manglet.

**Ferdig når:**
- `?mock=broken` gir en tydelig feilmelding.
- `?mock=error` viser «Prøv igjen», og knappen henter spørsmålene på nytt.
- `?mock=slow` viser «Laster spørsmål …».
- `src/api/guards.ts` er slettet, og `npm run typecheck` og `npm test` går gjennom.

1. Lag et `QuestionSchema` i `src/api/schemas.ts`, og la typen `Question` komme fra skjemaet.
2. Bytt type guarden i `src/api/questions.ts` med skjemaet, og slett `src/api/guards.ts`.
3. Skriv om `useQuestions` til å bruke `useQuery`.
4. I `QuizGame.tsx`: vis lasting og feil ut fra `status`. Bruk `ErrorMessage` med «Prøv igjen».

<details>
<summary>Hint: skjemaet og typen</summary>

`z.object({ ... })` beskriver formen. `z.enum(CATEGORIES)` passer for kategorien. `z.infer<typeof QuestionSchema>` gir deg typen. Eksporter typen fra `types.ts` som før, så resten av koden ikke må endres.

<details>
<summary>Vis koden</summary>

```ts
// src/api/schemas.ts
export const QuestionSchema = z.object({
  id: z.string(),
  text: z.string(),
  options: z.array(z.string()),
  correct: z.number(),
  category: z.enum(CATEGORIES),
});
export type Question = z.infer<typeof QuestionSchema>;

// src/types.ts
export type { Question } from "./api/schemas";
```

I `fetchQuestions`:

```ts
const result = z.array(QuestionSchema).safeParse(await res.json());
if (!result.success) throw new Error("Svaret fra API-et hadde ikke formen vi forventet");
return result.data;
```

`types.ts` og `schemas.ts` importerer fra hverandre, men siden `types.ts` bare eksporterer en type, blir det ingen sirkel når appen kjører.
</details>
</details>

<details>
<summary>Hint: useQuery og status</summary>

```ts
export function useQuestions() {
  return useQuery({ queryKey: ["questions"], queryFn: fetchQuestions });
}
```

```tsx
if (questions.status === "pending") return <Message>Laster spørsmål …</Message>;
if (questions.status === "error") {
  return <ErrorMessage message={questions.error.message} onRetry={() => questions.refetch()} />;
}
// her vet TypeScript at questions.data finnes
```
</details>

---

## Nivå 2 – Lagre resultatet i topplista

**Mål:** Spilleren kan lagre resultatet sitt, og topplista oppdateres med en gang.

**Hvorfor:** Å endre data på serveren er noe annet enn å lese. Du må vise at det lagres, håndtere feil, og si fra om hvilke data i cachen som nå er utdatert.

**Ferdig når:** «Lagre resultatet» på resultatskjermen viser «Lagrer …» mens den jobber, og resultatet ditt dukker opp i topplista uten at du laster siden på nytt.

1. Har du ikke topplista fra demoen: hent den med `useQuery`, valider den med et skjema, og vis den med `Leaderboard` på resultatskjermen.
2. Lag `postResult(result)` i `src/api/leaderboard.ts`, som sender en `POST` til `/api/results`.
3. Lag en hook `useSaveResult()` med `useMutation`. Når lagringen lykkes, be om at topplista hentes på nytt.
4. Legg til knappen på resultatskjermen, og vis «Lagrer …» og «Resultatet er lagret.».

<details>
<summary>Hint: lagre og oppdatere topplista</summary>

`useQueryClient()` gir deg cachen. `invalidateQueries` med nøkkelen til topplista sier at den er utdatert, og da henter TanStack Query den på nytt. Kall `mutate` fra `onClick`, ikke fra en effect.

<details>
<summary>Vis koden</summary>

```ts
export type NewResult = { name: string; score: number; total: number };

export async function postResult(result: NewResult) {
  const res = await fetch("/api/results", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(result),
  });
  if (!res.ok) throw new Error(`Kunne ikke lagre resultatet (${res.status})`);
  return LeaderboardEntrySchema.parse(await res.json());
}

export function useSaveResult() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postResult,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["leaderboard"] }),
  });
}
```
</details>
</details>

---

## Ekstra

### A – Error Boundary rundt topplista

**Mål:** Feiler topplista, vises en vennlig melding der den skulle vært, mens resten av appen virker som før.

**Ferdig når:** Med `?mock=leaderboard-error` kan du fortsatt spille, og topplista viser «Topplista er ikke tilgjengelig akkurat nå» med en «Prøv igjen»-knapp som virker.

1. Legg til `throwOnError: true` i `useQuery` for topplista.
2. Pakk topplista inn i `ErrorBoundary` fra `react-error-boundary`, med en egen fallback-komponent.
3. Koble «Prøv igjen» til `useQueryErrorResetBoundary()`, så topplista hentes på nytt.

**Tenk over:** Kaster du en feil i `onClick` på «Lagre resultatet», fanger Error Boundary-en den? Hvorfor, eller hvorfor ikke?

### B – Bygg noe eget

Bruk det du lærte i dag til å legge til noe nytt i quizen. Det finnes ingen fasit. Vis gjerne fram det du laget i oppsummeringen. Noen ideer:

- **Et nytt endepunkt.** Legg til for eksempel `GET /api/stats` i `src/mocks/handlers.ts`, valider svaret med Zod, og vis det i appen.
- **«Ny rekord!»** Vis en melding hvis resultatet havner øverst i topplista.
- **Lengste rekke i topplista.** Send med lengste rekke når resultatet lagres, og vis den i lista. Husk både skjemaet og mock-backenden.
