# React & TypeScript i praksis – startprosjekt

Gjennom kurset bygger du videre på et quiz-spill. Alt av UI er ferdig, så du kan bruke tiden på det hver økt handler om.

## Krav

- Node.js 20.19 eller nyere (eller 22.12 eller nyere)
- Tilgang til npm (for `npm install`)
- En editor, for eksempel VS Code
- Chrome eller Edge med React Developer Tools

## Mappestruktur

Hver økt har en egen mappe:

| Mappe | Innhold |
| --- | --- |
| `session-N/start` | Startkoden og oppgavene (`EXERCISES.md`) for økta |
| `session-N/solution` | Løsningsforslag for økta |
| `session-N/cheatsheet.md` | Cheatsheet for økta: begreper, kodemønstre og vanlige feil |

| Økt | Tema |
| --- | --- |
| `session-1` | Avansert TypeScript |
| `session-2` | Hooks: gjør quizen spillbar |
| `session-3` | Hvor bor staten? Fra Context til Zustand |
| `session-4` | Data fra serveren: TanStack Query, Zod og feilhåndtering |
| `session-5` | Klar for produksjon: hva skjer i bygget, og feilrapportering med Elastic APM |
| `session-6` | Tester som gir trygghet: Testing Library og MSW |

Hver `start`- og `solution`-mappe er et eget prosjekt. Startkoden i en økt bygger på løsningen fra økta før, så henger du etter, kan du alltid starte neste økt fra `start`-mappen.

## Kom i gang

```bash
cd session-1/start
npm install
npm run dev
```

## Mock-backenden

Appen henter spørsmål fra `/api/questions`. Svaret kommer fra en mock-backend ([MSW](https://mswjs.io)) som kjører i nettleseren, så du trenger ingen server.

Du kan styre den ved å legge til en parameter i adressen i nettleseren, for eksempel http://localhost:5173/?mock=broken:

| Parameter | Hva skjer |
| --- | --- |
| `?mock=slow` | Svaret kommer etter 2 sekunder |
| `?mock=error` | Svaret er en 500-feil med en HTML-side |
| `?mock=broken` | Ett av spørsmålene mangler feltet `text` |

## Hvis noe ikke virker

| Problem | Prøv dette |
| --- | --- |
| `npm install` feiler | Sjekk at du har tilgang til npm, og at du står i en `start`- eller `solution`-mappe |
| Feil Node-versjon | Kjør `node -v`. Du trenger 20.19 eller nyere. |
| Siden er tom, og konsollen nevner `mockServiceWorker.js` | Kjør `npx msw init public`, og last siden på nytt |
| Port 5173 er opptatt | Bruk adressen Vite viser i terminalen |
| Rare feil etter å ha flyttet mappen | Slett `node_modules`, og kjør `npm install` på nytt |
