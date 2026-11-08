# Cheatsheet – Økt 4: Data fra serveren

## Begreper

| Begrep | Kort forklart |
| --- | --- |
| Server-state | Data som eies av serveren. Du har bare en kopi, og den kan bli utdatert. |
| Cache | Et mellomlager. TanStack Query husker data under en `queryKey`, så de ikke må hentes på nytt hver gang. |
| `queryKey` | Navnet på dataene i cachen. Samme nøkkel gir samme data, også i ulike komponenter. |
| `queryFn` | Funksjonen som henter dataene. Må kaste en feil når noe går galt. |
| Query | Lesing av data: `useQuery`. |
| Mutation | Endring av data på serveren: `useMutation`. |
| Invalidering | Å si at data i cachen er utdatert, så de hentes på nytt: `invalidateQueries`. |
| Schema | En beskrivelse av hvordan data skal se ut, som kan sjekkes når koden kjører (Zod). |
| Error Boundary | En komponent som fanger feil under rendering i komponentene under seg, og viser en reserve-UI. |

Husk: TypeScript sjekker koden du skriver. Validering sjekker dataene du mottar.

## Mønstre

### Hente data med `fetch`

```ts
const res = await fetch("/api/questions");
if (!res.ok) throw new Error(`Kunne ikke hente spørsmål (${res.status})`); // fetch kaster ikke ved 404 og 500
const data: unknown = await res.json();
```

### Zod-skjema og type

```ts
import { z } from "zod";

export const QuestionSchema = z.object({
  id: z.string(),
  text: z.string(),
  options: z.array(z.string()),
  correct: z.number(),
  category: z.enum(["react", "typescript", "web"]),
});
export type Question = z.infer<typeof QuestionSchema>;
```

### Sjekk dataene når de kommer inn

```ts
const result = z.array(QuestionSchema).safeParse(await res.json());
if (!result.success) {
  console.error(z.prettifyError(result.error)); // detaljer for utviklere
  throw new Error("Svaret fra API-et hadde ikke formen vi forventet"); // melding for brukeren
}
return result.data; // Question[]
```

`parse` kaster en feil med en gang. `safeParse` lar deg bestemme hva som skal skje.

### Lese data med `useQuery`

```tsx
const questions = useQuery({ queryKey: ["questions"], queryFn: fetchQuestions });

if (questions.status === "pending") return <Message>Laster …</Message>;
if (questions.status === "error") {
  return <ErrorMessage message={questions.error.message} onRetry={() => questions.refetch()} />;
}
return <Game questions={questions.data} />; // her vet TypeScript at data finnes
```

### Endre data med `useMutation`

```tsx
const queryClient = useQueryClient();
const save = useMutation({
  mutationFn: postResult,
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ["leaderboard"] }),
});

<button onClick={() => save.mutate(result)} disabled={save.isPending}>
  {save.isPending ? "Lagrer …" : "Lagre resultatet"}
</button>
```

### Error Boundary med TanStack Query

```tsx
const { reset } = useQueryErrorResetBoundary();

<ErrorBoundary onReset={reset} FallbackComponent={Fallback}>
  <Leaderboard />  {/* useQuery({ ..., throwOnError: true }) */}
</ErrorBoundary>

function Fallback({ resetErrorBoundary }: FallbackProps) {
  return <ErrorMessage message="Topplista er ikke tilgjengelig." onRetry={resetErrorBoundary} />;
}
```

### Hva fanger en Error Boundary?

| Fanger | Fanger ikke |
| --- | --- |
| Feil under rendering i komponentene under | Feil i event-handlere (`onClick`) |
| Feil fra TanStack Query med `throwOnError: true` | Feil i asynkron kode (`setTimeout`, `await` i en handler) |
| | Feil i Error Boundary-en selv |

### Nyttige innstillinger i TanStack Query

| Innstilling | Hva den gjør |
| --- | --- |
| `retry` | Antall nye forsøk ved feil. Standard er 3. |
| `staleTime` | Hvor lenge data regnes som ferske. Standard er 0, så data hentes på nytt når du for eksempel bytter fane. |
| `enabled` | `false` gjør at spørringen ikke kjører, for eksempel før man vet hva som skal hentes. |

## Vanlige feil

| Unngå | Bruk heller |
| --- | --- |
| `useState` + `useEffect` for å hente data | `useQuery` |
| Data fra API-et kopiert inn i en store | La dem ligge i TanStack Query-cachen |
| `res.json()` rett inn i koden | Valider med et Zod-skjema |
| En egen type ved siden av skjemaet | `z.infer<typeof Schema>` |
| Glemme `res.ok` | Kast en feil når `res.ok` er `false` |
| Lagre data i en effect når en skjerm vises | Kall `mutate` fra en event-handler |
| Oppdatere cachen for hånd etter en endring | `invalidateQueries` |
| Error Boundary som eneste feilhåndtering | Vis `status: "error"` der dataene brukes, og bruk Error Boundary som sikkerhetsnett |

## Les mer

- [Quick Start](https://tanstack.com/query/latest/docs/framework/react/quick-start) i TanStack Query-dokumentasjonen
- [Important Defaults](https://tanstack.com/query/latest/docs/framework/react/guides/important-defaults) i TanStack Query-dokumentasjonen
- [Basic usage](https://zod.dev/basics) i Zod-dokumentasjonen
- [react-error-boundary](https://github.com/bvaughn/react-error-boundary) på GitHub
