# Økt 5: Klar for produksjon – oppgaver

Du har 90 minutter. Det er to nivåer, og to ekstraoppgaver for dem som blir ferdige. Alle starter på nivå 1. Det er helt greit å bare bli ferdig med nivå 1.

`session-5/start` bygger på løsningen fra økt 4. `@elastic/apm-rum` og `rollup-plugin-visualizer` er installert, og mock-backenden tar imot feilrapporter på `POST /api/errors`.

| Tid | Hva |
| --- | --- |
| 0–10 min | Kom i gang: start prosjektet og les oppgaven |
| 10–45 min | Nivå 1 |
| 45–80 min | Nivå 2, og ekstraoppgavene hvis du har tid |
| 80–90 min | Felles oppsummering |

## Kom i gang

```bash
cd session-5/start
npm install
npm run dev
```

Cheatsheetet ligger i `session-5/cheatsheet.md`. Nye kommandoer i denne økta:

| Kommando | Hva den gjør |
| --- | --- |
| `npm run build` | Bygger appen for produksjon i `dist/` |
| `npm run preview` | Kjører det ferdige bygget lokalt |
| `npm run analyze` | Bygger appen og viser hva bundlen består av |

Miljøvariablene ligger i `.env` (alltid) og `.env.production` (`npm run build`). Mock-backenden styres med `?mock=...` som før.

## Står du fast?

1. Les «Ferdig når» på nytt.
2. Åpne hintet for det du står fast på. Det gir deg retningen.
3. Står du fortsatt fast, åpne «Vis koden» inne i hintet.
4. Se i `session-5/solution`.

Det er helt greit å jobbe to og to.

---

## Nivå 1 – Rapporter feil til ett sted

**Mål:** Alle feil fra API-et og fra lagring havner på ett sted, og sendes til Elastic APM i produksjon.

**Hvorfor:** En feil som TanStack Query fanger, ser ikke APM-agenten. Uten rapportering vet du ikke om feilene brukerne får. Med ett sted for rapporteringen glemmer du ingen.

**Ferdig når:**
- Med `?mock=leaderboard-error` og med `?mock=error` ser du et `POST /api/errors` i Network-fanen, og en melding i konsollen som starter med `[feilrapport]`.
- All rapportering går gjennom `reportError` i `src/monitoring.ts`. Ingen komponenter kaller `console.error` eller APM direkte.

1. Lag `reportError(error: unknown, context?: Record<string, string>)` i `src/monitoring.ts`.
2. Er `VITE_APM_SERVER_URL` satt: send feilen til Elastic APM. Ellers: logg den, og send den til `POST /api/errors`.
3. Kall `reportError` for alle spørringer og endringer, fra ett sted i `main.tsx`.
4. Test med `?mock=leaderboard-error` og `?mock=error`.

<details>
<summary>Hint: ett sted for alle spørringer</summary>

`QueryClient` kan få en `QueryCache` og en `MutationCache`. Begge har en `onError` som kalles for alle feil i hele appen. `error` har typen `unknown` (økt 1), så gjør den om til en `Error` først.

<details>
<summary>Vis koden</summary>

```ts
const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => reportError(error, { queryKey: JSON.stringify(query.queryKey) }),
  }),
  mutationCache: new MutationCache({
    onError: (error) => reportError(error),
  }),
});
```
</details>
</details>

<details>
<summary>Hint: reportError</summary>

```ts
import { init as initApm } from "@elastic/apm-rum";

const serverUrl = import.meta.env.VITE_APM_SERVER_URL;
const apm = serverUrl
  ? initApm({ serviceName: "quiz", serverUrl, serviceVersion: import.meta.env.VITE_APP_VERSION, environment: import.meta.env.MODE })
  : null;

export function reportError(error: unknown, context: Record<string, string> = {}): void {
  const err = error instanceof Error ? error : new Error(String(error));
  if (apm) {
    apm.addLabels(context);
    apm.captureError(err);
    return;
  }
  console.error("[feilrapport]", err.message, context);
  fetch("/api/errors", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: err.message, context }),
  });
}
```
</details>

**Tenk over:** Komponentene viser fortsatt feilen til brukeren. Hvorfor er det lurt å rapportere og vise feilen på to forskjellige steder?

---

## Nivå 2 – Feilene ingen ser

**Mål:** Også feil under rendering, og feil som ingen fanger, havner i `reportError`.

**Hvorfor:** APM-agenten fanger feil som ingen fanger, av seg selv. Men uten agenten, for eksempel lokalt, ser du dem bare i konsollen. Og feil som en Error Boundary fanger, ser agenten ikke i det hele tatt.

**Ferdig når:**
- `setTimeout(() => { throw new Error("test") })` skrevet i konsollen i nettleseren gir en `[feilrapport]`.
- `Promise.reject(new Error("test"))` skrevet i konsollen gir også en `[feilrapport]`.
- Med `?mock=leaderboard-broken` rapporteres feilen fra Error Boundary-en rundt topplista.

1. Gi `ErrorBoundary` i `LeaderboardSection.tsx` en `onError` som kaller `reportError`.
2. Lag `reportUncaughtErrors()` i `monitoring.ts`, som lytter etter feil ingen fanger. Kall den én gang i `main.tsx`.
3. Er APM slått på, lytter agenten selv. Gjør da ingenting, så feilen ikke rapporteres to ganger.
4. Pass på at en feil i selve rapporten ikke blir en ny feil som rapporteres.

<details>
<summary>Hint: feil ingen fanger</summary>

Nettleseren sender hendelsen `error` på `window` for feil som kastes, og `unhandledrejection` for Promise-er som avvises uten `catch`.

<details>
<summary>Vis koden</summary>

```ts
export function reportUncaughtErrors(): void {
  if (apm) return;
  window.addEventListener("error", (event) => reportError(event.error ?? event.message));
  window.addEventListener("unhandledrejection", (event) => reportError(event.reason));
}
```
</details>
</details>

<details>
<summary>Hint: en evig løkke</summary>

Feiler `fetch` til `/api/errors`, for eksempel uten nett, blir det en ufanget feil, som rapporteres, som feiler … Legg til `.catch(() => {})` på `fetch` i `reportError`.
</details>

**Tenk over:** Med `?mock=leaderboard-error` kan feilen bli rapportert to ganger. Hvorfor? Hvordan ville du unngått det?

---

## Ekstra

### A – Mer kontekst i rapportene

**Mål:** Hver feilrapport sier hvilken versjon og hvilket miljø den kom fra, og hvor i appen brukeren var.

**Ferdig når:** Rapporten i konsollen har med versjon, miljø og side, også når du kjører `npm run build` og `npm run preview`.

1. Legg til `versjon`, `miljø` og `side` i konteksten i `reportError`, for alle rapporter.
2. Kjør `npm run build` og `npm run preview`. Hvilken verdi har `miljø` nå? (Mock-backenden er bare med i utvikling, så API-kallene feiler her. Det gir deg feil å se på.)

**Tenk over:** Ville du sendt med spillernavnet? Hva med et fødselsnummer i en ekte app? Hvem kan lese det som havner i APM?

### B – Bygg noe eget

Bruk det du lærte i dag til å legge til noe nytt i quizen. Det finnes ingen fasit. Vis gjerne fram det du laget i oppsummeringen. Noen ideer:

- **«Meld fra om et problem».** En knapp der brukeren skriver hva som skjedde, som sendes med `reportError`.
- **Versjonen i feilmeldingen.** Vis versjonen i feilmeldingene brukeren ser, så support vet hva de skal se etter.
- **Egne miljøvariabler.** Slå en ny funksjon av og på med en `VITE_`-variabel, og se at den forsvinner fra bygget når den er av.
