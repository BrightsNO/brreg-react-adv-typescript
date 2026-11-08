# Cheatsheet – Økt 5: Klar for produksjon

## Begreper

| Begrep | Kort forklart |
| --- | --- |
| Build | `npm run build` gjør kildekoden om til ferdige filer i `dist/`, som kan legges på en server. |
| Bundle | Én eller flere JS-filer med all koden appen trenger, inkludert biblioteker. |
| Tree-shaking | Kode som aldri brukes, fjernes fra bundlen. |
| Hash i filnavn | `index-a1b2c3.js`. Endres koden, endres navnet, så nettleseren vet at den må hente filen på nytt. |
| Miljøvariabel | En verdi som kan være ulik lokalt, i test og i produksjon, for eksempel en adresse. |
| APM | Application Performance Monitoring. Samler feil og ytelse fra brukernes nettlesere, så du ser hva som skjer i produksjon. |
| RUM | Real User Monitoring. APM-agenten som kjører i nettleseren (`@elastic/apm-rum`). |
| tsdown | Bygger pakker som andre prosjekter importerer, med typefiler (`.d.ts`). Vite bygger apper. |

## Mønstre

### Hva skjer i npm run build?

1. Vite starter i `index.html`, og følger alle `import` fra `main.tsx`.
2. Kode som aldri brukes, fjernes (tree-shaking).
3. Typene fjernes, og koden gjøres mindre.
4. Filene får en hash i navnet.

Det nettleseren kjører, er vanlig JavaScript uten typer. Derfor validerer vi data fra serveren med Zod (økt 4).

`npm run build` kjører `tsc -b` først, fordi Vite selv ikke sjekker typene.

### Miljøvariabler i Vite

```bash
# .env (alltid), .env.production (npm run build), .env.local (bare hos deg, ikke i git)
VITE_APM_SERVER_URL=https://apm.eksempel.no
```

```ts
const url = import.meta.env.VITE_APM_SERVER_URL;
const isDev = import.meta.env.DEV;  // true i npm run dev, false i bygget
const mode = import.meta.env.MODE;  // "development" eller "production"
```

Vite bytter ut `import.meta.env.VITE_...` med selve verdien når appen bygges:

```ts
// Kildekoden                                // I dist/
serverUrl: import.meta.env.VITE_APM_SERVER_URL  →  serverUrl: "https://apm.eksempel.no"
if (!import.meta.env.DEV) return;               →  if (true) return;  // resten fjernes
```

Alt som starter med `VITE_` kan alle lese. Ikke legg hemmeligheter der.

Gi variablene typer i `src/vite-env.d.ts`:

```ts
interface ImportMetaEnv {
  readonly VITE_APM_SERVER_URL: string;
}
```

### Elastic APM

```ts
import { init as initApm } from "@elastic/apm-rum";

const apm = initApm({
  serviceName: "quiz",
  serverUrl: import.meta.env.VITE_APM_SERVER_URL,
  serviceVersion: import.meta.env.VITE_APP_VERSION,
  environment: import.meta.env.MODE,
});

apm.addLabels({ del: "toppliste" });
apm.captureError(error);
```

### Hvilke feil ser APM-agenten?

Agenten ser bare feil som ingen fanger. En feil som noen fanger, må du rapportere selv.

| Feilen | Fanges av | Ser agenten den? |
| --- | --- | --- |
| Kastes i en `onClick` | Ingen | Ja |
| `useQuery` feiler | TanStack Query | Nei. Rapporter fra `QueryCache` |
| Kastes under rendering | Error Boundary | Nei. Rapporter fra `onError` |
| `fetch` gir 404, og ingen sjekker `res.ok` | Ingen, for det er ingen feil | Nei. Sjekk `res.ok` (økt 4) |

### Rapporter fra få, faste steder

```ts
// main.tsx
const queryClient = new QueryClient({
  queryCache: new QueryCache({ onError: (error) => reportError(error) }),
  mutationCache: new MutationCache({ onError: (error) => reportError(error) }),
});

// Feil ingen fanger, når APM er slått av
window.addEventListener("error", (event) => reportError(event.error));
window.addEventListener("unhandledrejection", (event) => reportError(event.reason));
```

```tsx
<ErrorBoundary onError={(error) => reportError(error)} FallbackComponent={Fallback}>
```

## Vanlige feil

| Unngå | Bruk heller |
| --- | --- |
| Hemmeligheter i `VITE_`-variabler | Hold hemmeligheter på serveren |
| Teste bare med `npm run dev` | Prøv bygget med `npm run build` og `npm run preview` |
| `console.error` spredt rundt i koden | Én `reportError`, kalt fra få, faste steder |
| `error.message` på en `unknown` | `error instanceof Error ? error : new Error(String(error))` |
| Rapporten feiler og rapporteres på nytt | `.catch` på `fetch` i `reportError` |
| Personopplysninger i feilrapporten | Send bare det du trenger for å feilsøke |

## Les mer

- [Building for Production](https://vite.dev/guide/build) i Vite-dokumentasjonen
- [Env Variables and Modes](https://vite.dev/guide/env-and-mode) i Vite-dokumentasjonen
- [Elastic APM Real User Monitoring](https://www.elastic.co/guide/en/apm/agent/rum-js/current/index.html) hos Elastic
- [tsdown](https://tsdown.dev/guide/), for å bygge pakker
