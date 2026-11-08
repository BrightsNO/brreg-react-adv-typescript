# Økt 6: Tester som gir trygghet – oppgaver

Du har 90 minutter. Det er to nivåer, og to ekstraoppgaver for dem som blir ferdige. Alle starter på nivå 1. Det er helt greit å bare bli ferdig med nivå 1.

`session-6/start` bygger på løsningen fra økt 5. Testing Library og jsdom er installert, og oppsettet for testene er ferdig:

| Fil | Hva den gjør |
| --- | --- |
| `vite.config.ts` | Kjører testene i jsdom, en nettleser laget i JavaScript |
| `src/test/setup.ts` | Kjøres før testene: starter mock-backenden, og nullstiller storene før hver test |
| `src/test/render.tsx` | `renderWithProviders(...)`: rendrer en komponent med TanStack Query rundt, og gir deg `user` |
| `src/mocks/server.ts` | Den samme mock-backenden som i nettleseren, men for testene |

| Tid | Hva |
| --- | --- |
| 0–10 min | Kom i gang: kjør testene og les oppgaven |
| 10–45 min | Nivå 1 |
| 45–80 min | Nivå 2, og ekstraoppgavene hvis du har tid |
| 80–90 min | Felles oppsummering |

## Kom i gang

```bash
cd session-6/start
npm install
npm test
```

`npm test` kjører testene på nytt hver gang du lagrer en fil. Trykk `q` for å avslutte. Testene fra før skal være grønne. Cheatsheetet ligger i `session-6/cheatsheet.md`.

Demotesten fra foreleseren ligger i `session-6/solution/src/QuizGame.test.tsx`. Bruk den som mal.

## Står du fast?

1. Les «Ferdig når» på nytt.
2. Les feilmeldingen fra testen. Finner ikke Testing Library et element, skriver den ut hele skjermen, så du ser hva som faktisk vises.
3. Skriv `screen.debug()` i testen for å se hva som er rendret akkurat der.
4. Åpne hintet, og så «Vis koden» inne i det.
5. Se i `session-6/solution`.

Det er helt greit å jobbe to og to.

---

## Nivå 1 – Test topplista

**Mål:** Tester som sjekker at topplista viser det brukeren skal se: mens den lastes, når dataene kommer, og når noe går galt.

**Hvorfor:** Topplista har alle tilstandene en komponent med data fra serveren kan ha. Tester du dem én gang, vet du hvordan du tester alle andre komponenter som henter data.

**Ferdig når:** `src/components/LeaderboardSection.test.tsx` har fire grønne tester:
- «Laster topplista …» vises med en gang.
- Når svaret kommer, viser lista tre resultater, blant dem Ada.
- Når serveren svarer med 500, vises «Topplista er ikke tilgjengelig akkurat nå.» og en «Prøv igjen»-knapp.
- Trykker du «Prøv igjen», vises topplista.

1. Lag `src/components/LeaderboardSection.test.tsx`, og render komponenten med `renderWithProviders`.
2. Skriv én test for hver av de fire tilstandene.
3. Ødelegg koden med vilje, for eksempel ved å endre teksten i `LeaderboardFallback`. Blir testen rød? Sett koden tilbake.

<details>
<summary>Hint: lasting og data</summary>

Lasteteksten finnes med en gang, så `getBy` holder. Lista kommer først når svaret er kommet, så der trenger du `await findBy...`. Lista heter «Toppliste» (se `aria-label` i `Leaderboard.tsx`).

<details>
<summary>Vis koden</summary>

```ts
renderWithProviders(<LeaderboardSection />);
expect(screen.getByText("Laster topplista …")).toBeInTheDocument();
```

```ts
const list = await screen.findByRole("list", { name: "Toppliste" });
expect(within(list).getAllByRole("listitem")).toHaveLength(3);
```
</details>
</details>

<details>
<summary>Hint: feil fra serveren</summary>

Med `server.use(...)` bytter du ut svaret fra mock-backenden, bare i én test. Sett det opp før du rendrer. For «Prøv igjen» skal bare det første kallet feile.

<details>
<summary>Vis koden</summary>

```ts
import { http, HttpResponse } from "msw";
import { server } from "../mocks/server";

server.use(http.get("/api/leaderboard", () => HttpResponse.json(null, { status: 500 })));

// Bare det første kallet feiler:
server.use(http.get("/api/leaderboard", () => HttpResponse.json(null, { status: 500 }), { once: true }));
```

Klikk med `await user.click(...)`, der `user` kommer fra `renderWithProviders`.
</details>
</details>

<details>
<summary>Hint: røde feilmeldinger i terminalen, men testen er grønn</summary>

Det er forventet i feiltestene. React logger feilen som Error Boundary-en fanger, og `reportError` fra økt 5 logger den også. Testen er grønn så lenge den ikke sier `FAIL`.
</details>

**Tenk over:** Testen bryr seg ikke om at topplista bruker TanStack Query og en Error Boundary. Hva betyr det hvis du bytter dem ut senere?

---

## Nivå 2 – Spill hele quizen i en test

**Mål:** Én test som spiller quizen fra start til slutt, slik en bruker ville gjort, og lagrer resultatet.

**Hvorfor:** Én slik test gir trygghet for hele flyten, også for koden fra de andre øktene: typene, effectene, storene og kallene til API-et.

**Ferdig når:** `src/fullGame.test.tsx` har en grønn test som:
- skriver navnet «Testesen» og starter quizen
- svarer riktig på alle spørsmålene
- sjekker at det står «Ferdig, Testesen!», «8 av 8 riktige» og «Lengste rekke: 8 riktige på rad»
- lagrer resultatet, og finner «Testesen» i topplista

1. Render `<QuizGame />`, skriv navnet, og start quizen.
2. Svar riktig på alle spørsmålene i en løkke. Fasiten finner du i de samme dataene som mock-backenden bruker, `src/mocks/data.ts`.
3. Sjekk resultatskjermen, lagre resultatet, og let etter navnet i topplista.

<details>
<summary>Hint: løkken</summary>

Navnet på en knapp er teksten i den. Svarknappene har tallet for tasten først, for eksempel «2 useState». Usikker? Skriv `screen.debug()`.

<details>
<summary>Vis koden</summary>

```ts
import { questions } from "./mocks/data";

for (const [i, question] of questions.entries()) {
  const correct = question.options[question.correct];
  await user.click(screen.getByRole("button", { name: `${question.correct + 1} ${correct}` }));
  const isLast = i === questions.length - 1;
  await user.click(screen.getByRole("button", { name: isLast ? "Se resultat" : "Neste spørsmål" }));
}
```
</details>
</details>

<details>
<summary>Hint: navnet finnes flere steder</summary>

«Testesen» står også øverst i spillet. Let bare inne i topplista:

```ts
const list = await screen.findByRole("list", { name: "Toppliste" });
expect(await within(list).findByText("Testesen")).toBeInTheDocument();
```
</details>

**Tenk over:** Denne testen sjekker mye på en gang. Hva er fordelen? Hva er ulempen når den blir rød?

---

## Ekstra

### A – Test feilrapporteringen fra økt 5

**Mål:** En test som viser at feilen sendes til `POST /api/errors` når topplista feiler.

**Ferdig når:** `src/monitoring.test.tsx` har en grønn test som sjekker at det kom en rapport med meldingen «Kunne ikke hente topplista (500)».

1. La `GET /api/leaderboard` svare med 500, og legg til en handler for `POST /api/errors` som tar vare på rapportene.
2. Render `<LeaderboardSection />`, og vent på rapporten med `waitFor`.
3. Sjekk også at det kom en rapport fra Error Boundary-en. Husker du hvorfor feilen rapporteres to ganger?

<details>
<summary>Hint: ta vare på rapportene</summary>

```ts
const reports: unknown[] = [];
server.use(
  http.post("/api/errors", async ({ request }) => {
    reports.push(await request.json());
    return new HttpResponse(null, { status: 204 });
  }),
);

await waitFor(() =>
  expect(reports).toContainEqual(expect.objectContaining({ message: "Kunne ikke hente topplista (500)" })),
);
```
</details>

### B – Bygg noe eget

Skriv tester for noe du synes er verdt å teste. Det finnes ingen fasit. Noen ideer:

- **Noe du bygde selv** i «Bygg noe eget» i en tidligere økt.
- **Tastene 1–4 fra økt 2.** `await user.keyboard("2")` trykker en tast.
- **Innstillingene fra økt 3.** Endre antall sekunder, og sjekk at nedtellingen starter på riktig tall.
