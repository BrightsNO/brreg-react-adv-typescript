# Cheatsheet – Økt 6: Tester som gir trygghet

## Begreper

| Begrep | Kort forklart |
| --- | --- |
| Enhetstest | Tester én funksjon eller store, uten React og uten nettverk. Rask. |
| Komponenttest | Rendrer komponenter og klikker i dem, med en mock-backend. Tester det brukeren ser. |
| Systemtest | Ekte nettleser og ekte server, for eksempel med Playwright. Tregest, gir mest trygghet per test. |
| Vitest | Kjører testene. `describe`, `it` og `expect`. |
| jsdom | En nettleser laget i JavaScript. Gir testene `document`, `window` og `localStorage`. |
| Testing Library | Rendrer komponenter og finner elementer slik en bruker ville gjort: på rolle og tekst. |
| user-event | Klikker og skriver som en ekte bruker. |
| MSW | Mock-backenden. Den samme i nettleseren (`setupWorker`) og i testene (`setupServer`). |

## Mønstre

### En komponenttest

```tsx
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithProviders } from "./test/render";
import { QuizGame } from "./QuizGame";

describe("QuizGame", () => {
  it("viser «Riktig!» når spilleren svarer riktig", async () => {
    const { user } = renderWithProviders(<QuizGame />);

    await user.click(await screen.findByRole("button", { name: "Start quiz" }));
    await user.click(screen.getByRole("button", { name: "2 useState" }));

    expect(screen.getByText("Riktig!")).toBeInTheDocument();
  });
});
```

### getBy, queryBy eller findBy?

| | Finnes ikke | Bruk når |
| --- | --- | --- |
| `getBy...` | Kaster en feil | Elementet skal finnes nå |
| `queryBy...` | Gir `null` | Du vil sjekke at noe ikke finnes: `expect(...).not.toBeInTheDocument()` |
| `findBy...` | Venter, og kaster etter 1 sekund | Elementet kommer etter hvert, for eksempel etter et kall til API-et. Husk `await`. |

`getAllBy...`, `queryAllBy...` og `findAllBy...` gir en liste.

### Hvordan finne elementer

Bruk den første som passer:

| Spørring | Eksempel |
| --- | --- |
| `getByRole` | `getByRole("button", { name: "Start quiz" })`, `getByRole("heading", { name: /Ferdig/ })` |
| `getByLabelText` | `getByLabelText("Navnet ditt")` |
| `getByText` | `getByText("Riktig!")` |

Unngå klassenavn og `data-testid`. Brukeren ser dem ikke.

Let bare inne i ett element med `within`:

```ts
const list = await screen.findByRole("list", { name: "Toppliste" });
expect(within(list).getAllByRole("listitem")).toHaveLength(3);
```

### Klikke og skrive

```ts
const { user } = renderWithProviders(<StartScreen questions={questions} />);
await user.type(screen.getByLabelText("Navnet ditt"), "Ada");
await user.click(screen.getByRole("button", { name: "Start quiz" }));
```

Alt `user` gjør, returnerer et Promise. Husk `await`.

### Bytte ut svaret fra mock-backenden i én test

```ts
import { http, HttpResponse } from "msw";
import { server } from "./mocks/server";

server.use(http.get("/api/leaderboard", () => HttpResponse.json(null, { status: 500 })));

// Bare det første kallet:
server.use(http.get("/api/leaderboard", () => HttpResponse.json(null, { status: 500 }), { once: true }));
```

Sett det opp før `render`. `setup.ts` fjerner det etter hver test.

### Vente på noe som ikke vises

```ts
await waitFor(() => expect(reports).toHaveLength(1));
```

`waitFor` prøver på nytt til `expect` ikke kaster, eller til tiden går ut.

### Hva setup.ts gjør

| Når | Hva | Hvorfor |
| --- | --- | --- |
| Før alle testene | `server.listen({ onUnhandledRequest: "error" })` | Starter mock-backenden. Ukjente kall gir en feil. |
| Før hver test | Nullstiller storene | Zustand-storer er globale (økt 3). Ellers starter en test der den forrige sluttet. |
| Etter hver test | `cleanup()` og `server.resetHandlers()` | Fjerner det som er rendret, og handlers fra `server.use`. |

### Se hva testen ser

```ts
screen.debug(); // skriver ut det som er rendret
```

## Vanlige feil

| Unngå | Bruk heller |
| --- | --- |
| `getBy` på data fra serveren | `await findBy...` |
| Glemme `await` foran `findBy` og `user` | Alltid `await` |
| `server.use` etter `render` | `server.use` før `render` |
| Sjekke state i storen fra en komponenttest | Sjekke det som vises på skjermen |
| `container.querySelector(".option")` | `getByRole("button", { name: ... })` |
| En test du aldri har sett rød | Ødelegg koden med vilje, og se at testen feiler |

## Les mer

- [Queries](https://testing-library.com/docs/queries/about) i Testing Library-dokumentasjonen, særlig «Priority»
- [Common mistakes with React Testing Library](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library) av Kent C. Dodds
- [Mocking requests in Node.js](https://mswjs.io/docs/integrations/node) i MSW-dokumentasjonen
- [Getting Started](https://vitest.dev/guide/) i Vitest-dokumentasjonen
