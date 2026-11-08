# Økt 1: Avansert TypeScript – oppgaver

Du har 90 minutter. Det er to nivåer, og to ekstraoppgaver for dem som blir ferdige. Alle starter på nivå 1. Det er helt greit å bare bli ferdig med nivå 1.

| Tid | Hva |
| --- | --- |
| 0–10 min | Kom i gang: start prosjektet og les oppgaven |
| 10–45 min | Nivå 1 |
| 45–80 min | Nivå 2, og ekstraoppgavene hvis du har tid |
| 80–90 min | Felles oppsummering |

## Kom i gang

```bash
cd session-1/start
npm install
npm run dev
```

Åpne http://localhost:5173 og spill en runde, så du ser hvordan appen virker. Cheatsheetet ligger i `session-1/cheatsheet.md`.

| Sjekk arbeidet ditt | Hva den sjekker |
| --- | --- |
| `npm run typecheck` | At TypeScript ikke finner feil |
| `npm run lint` | At koden følger reglene, blant annet at det ikke finnes `any` |
| `npm test` | At testene går gjennom |

Mock-backenden kan styres fra adressen: `?mock=slow` (svaret kommer etter 2 sekunder), `?mock=error` (500-feil) og `?mock=broken` (ett spørsmål mangler feltet `text`).

## Står du fast?

1. Les «Ferdig når» på nytt.
2. Åpne hintet for det du står fast på. Det gir deg retningen.
3. Står du fortsatt fast, åpne «Vis koden» inne i hintet.
4. Se i `session-1/solution`.

Det er helt greit å jobbe to og to.

---

## Nivå 1 – Typer for spørsmålene

**Mål:** Ingen `any` i `src/`, og appen viser en feilmelding når API-et sender data med feil form.

**Hvorfor:** `any` skrur av TypeScript, så feil i koden blir ikke oppdaget. Data fra serveren kan ha hvilken som helst form, så de må sjekkes før resten av koden stoler på dem.

**Ferdig når:** `npm run lint`, `npm run typecheck` og `npm test` går gjennom, og `?mock=broken` viser en feilmelding i stedet for et spørsmål uten tekst.

1. Kjør `npm run lint`. Den viser hvor det brukes `any`.
2. Lag typene `Category` og `Question` i `src/types.ts`. Se på dataene i `src/mocks/data.ts` eller i Network-fanen.
3. Bytt ut `any` med `Question` i spillogikken og komponentene.
4. I `src/api/questions.ts`: les svaret som `unknown`, og sjekk det med en type guard før du returnerer det. Lag type guarden i en ny fil, `src/api/guards.ts`.
5. I `src/hooks/useQuestions.ts`: gi feilen i `catch` typen `unknown`.

<details>
<summary>Hint: Category og Question</summary>

Det finnes tre kategorier i dataene. En union av string-literaler passer godt. Se på ett spørsmål i `data.ts`, og skriv ned hvert felt og hvilken type det har.

<details>
<summary>Vis koden</summary>

```ts
export type Category = "react" | "typescript" | "web";

export type Question = {
  id: string;
  text: string;
  options: string[];
  correct: number;
  category: Category;
};
```
</details>
</details>

<details>
<summary>Hint: type guard</summary>

En type guard er en funksjon som returnerer `x is Question[]`. Sjekk først at verdien er en liste, så at hvert element er et objekt, og så ett og ett felt. TypeScript stoler blindt på svaret, så sjekker du for lite, er den like farlig som `as`.

<details>
<summary>Vis koden</summary>

```ts
function isRecord(x: unknown): x is Record<string, unknown> {
  return typeof x === "object" && x !== null;
}

function isQuestion(x: unknown): x is Question {
  return (
    isRecord(x) &&
    typeof x.id === "string" &&
    typeof x.text === "string" &&
    Array.isArray(x.options) && x.options.every((o) => typeof o === "string") &&
    typeof x.correct === "number" &&
    (x.category === "react" || x.category === "typescript" || x.category === "web")
  );
}

export function isQuestionList(x: unknown): x is Question[] {
  return Array.isArray(x) && x.every(isQuestion);
}
```

I `fetchQuestions`:

```ts
const data: unknown = await res.json();
if (!isQuestionList(data)) throw new Error("Svaret fra API-et hadde ikke formen vi forventet");
return data;
```
</details>
</details>

<details>
<summary>Hint: feilen i catch</summary>

```ts
.catch((e: unknown) => {
  const message = e instanceof Error ? e.message : "Ukjent feil";
  // ...
});
```
</details>

**Tenk over:** Prøv å returnere `res.json()` direkte fra en funksjon som skal gi `Question[]`. Hvorfor klager ikke TypeScript?

<details>
<summary>Svar</summary>

`res.json()` gir `Promise<any>`, og `any` kan tilordnes til alt. Lint fanger det heller ikke, fordi regelen bare ser `any` du har skrevet selv. Derfor leser vi svaret som `unknown`.
</details>

---

## Nivå 2 – Spilltilstanden som discriminated union

**Mål:** Én `GameState` i stedet for `isPlaying`, `showAnswer` og `isFinished`, og TypeScript sier fra hvis en fase ikke håndteres.

**Hvorfor:** Tre flagg gir åtte kombinasjoner, men bare fire gir mening. Med en discriminated union kan de ugyldige kombinasjonene ikke oppstå, og TypeScript finner stedene du har glemt.

**Ferdig når:** Spillet virker som før, og legger du til en ny fase i `GameState`, gir TypeScript en feil der den ikke håndteres.

1. Se på de tre boolske verdiene i `src/QuizGame.tsx`. Hvor mange kombinasjoner gir de, og hvor mange gir mening?
2. Lag `GameState` i `src/types.ts` med fasene `lobby`, `question`, `reveal` og `finished`. Gi hver fase bare de dataene den trenger.
3. Bytt de boolske verdiene, og gjerne `index` og `answers`, med én `useState<GameState>`.
4. Bytt `if`-ene nederst med en `switch` på fasen, med et sikkerhetsnett i `default`.
5. Test sikkerhetsnettet: legg til `| { phase: "paused" }` i `GameState`, se at TypeScript klager, og fjern den igjen.

<details>
<summary>Hint: GameState</summary>

Trenger du `index` i lobbyen? Trenger du `answers` når spillet er ferdig? Skriv ned hver fase og hva den må vite.

<details>
<summary>Vis koden</summary>

```ts
export type GameState =
  | { phase: "lobby" }
  | { phase: "question"; index: number; answers: number[] }
  | { phase: "reveal"; index: number; answers: number[] }
  | { phase: "finished"; answers: number[] };
```

```tsx
switch (game.phase) {
  case "lobby":
    return <StartScreen ... />;
  // ... question, reveal og finished
  default: {
    const unhandled: never = game;
    return unhandled;
  }
}
```
</details>
</details>

<details>
<summary>Hint: TypeScript klager på game.index</summary>

Du kan bare lese `game.index` etter at du har sjekket fasen, for eksempel `if (game.phase !== "question") return;`. Det er narrowing.
</details>

---

## Ekstra

### A – Poeng per kategori

**Mål:** Resultatskjermen viser poeng per kategori, og TypeScript passer på at ingen kategori blir glemt.

**Ferdig når:** Resultatskjermen viser poeng per kategori, det finnes en test for `scoreByCategory`, og legger du til `"css"` som kategori, sier TypeScript fra hvor koden må endres.

1. Lag kategoriene som en verdi med `as const`, og lag typen `Category` fra den.
2. Lag en mapped type `ScoreByCategory` med ett felt per kategori.
3. Skriv `scoreByCategory(questions, answers)` i `src/game/scoring.ts`, uten `as`, og vis resultatet på resultatskjermen.
4. Skriv en test for den i `scoring.test.ts`.

<details>
<summary>Hint: kategoriene og typen</summary>

```ts
export const CATEGORIES = ["react", "typescript", "web"] as const;
export type Category = (typeof CATEGORIES)[number];
export type ScoreByCategory = { [C in Category]: { correct: number; total: number } };
```
</details>

Vil du ha mer: skriv en generisk `groupBy<T, K extends keyof T>(items: T[], key: K): Map<T[K], T[]>`, eller en generisk `List<T>`-komponent som i demoen.

### B – Bygg noe eget

Bruk typene til å legge til noe nytt i quizen. Det finnes ingen fasit. Vis gjerne fram det du laget i oppsummeringen. Noen ideer:

- **En pause mellom spørsmålene.** Legg fasen `paused` til i `GameState`, og la TypeScript vise deg hvor koden må endres.
- **Vanskelighetsgrad på spørsmålene.** Legg til `difficulty` i dataene og i typen, og husk type guarden.
- **En egen melding når alt er riktig.** Hvilken fase hører den til?
