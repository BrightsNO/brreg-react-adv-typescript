# Økt 3: Hvor hører staten hjemme? – oppgaver

Du har 90 minutter. Det er to nivåer, og to ekstraoppgaver for dem som blir ferdige. Alle starter på nivå 1. Det er helt greit å bare bli ferdig med nivå 1.

`session-3/start` bygger på løsningen fra økt 2, men all state er samlet i én context, `QuizContext`. Det er utgangspunktet du skal rydde i.

| Tid | Hva |
| --- | --- |
| 0–10 min | Kom i gang: start prosjektet og les oppgaven |
| 10–45 min | Nivå 1 |
| 45–80 min | Nivå 2, og ekstraoppgavene hvis du har tid |
| 80–90 min | Felles oppsummering |

## Kom i gang

```bash
cd session-3/start
npm install
npm run dev
```

Sjekk arbeidet ditt med `npm run typecheck`, `npm run lint` og `npm test`. Cheatsheetet ligger i `session-3/cheatsheet.md`.

**Se hva som rendres:** Åpne React DevTools, klikk på tannhjulet under fanen Components, og slå på «Highlight updates when components render». Da blinker hver komponent som rendres på nytt.

## Står du fast?

1. Les «Ferdig når» på nytt.
2. Åpne hintet for det du står fast på. Det gir deg retningen.
3. Står du fortsatt fast, åpne «Vis koden» inne i hintet.
4. Se i `session-3/solution`.

Det er helt greit å jobbe to og to.

---

## Nivå 1 – Innstillingene i Zustand, og husk dem

**Mål:** Innstillingene ligger i en egen Zustand-store, og de huskes når siden lastes på nytt.

**Hvorfor:** Når en verdi i en context endres, rendres alle komponenter som leser contexten. En store med selectors rendrer bare komponentene som bruker akkurat den verdien. Og med storen på plass er det én linje å la innstillingene overleve en ny lasting av siden.

**Ferdig når:**
- Når du endrer en innstilling, blinker bare komponentene som bruker den, ikke resten av appen.
- Innstillingene står der fortsatt etter at du har lastet siden på nytt.

1. Slå på «Highlight updates», og bytt antall sekunder i innstillingene. Se hva som blinker.
2. Lag en store for innstillingene i `src/stores/settingsStore.ts`.
3. Bruk storen i `SettingsPanel` og `QuestionCard`, og fjern innstillingene fra `QuizContext`.
4. Bytt antall sekunder igjen, og se hva som blinker nå.
5. La storen huske innstillingene med `persist`. Sjekk i DevTools (Application, Local Storage) at de lagres.

<details>
<summary>Hint: storen</summary>

En Zustand-store er en hook du lager med `create`. Den holder både verdiene og funksjonene som endrer dem. Komponentene henter én verdi om gangen med en selector.

<details>
<summary>Vis koden</summary>

```ts
import { create } from "zustand";

type SettingsStore = {
  secondsPerQuestion: number;
  setSecondsPerQuestion: (seconds: number) => void;
};

export const useSettingsStore = create<SettingsStore>()((set) => ({
  secondsPerQuestion: 20,
  setSecondsPerQuestion: (seconds) => set({ secondsPerQuestion: seconds }),
}));
```

I komponenten, én selector per verdi:

```ts
const secondsPerQuestion = useSettingsStore((s) => s.secondsPerQuestion);
```

Legg merke til `create<SettingsStore>()(...)` med to sett parenteser. Det er slik Zustand vil ha det med TypeScript.
</details>
</details>

<details>
<summary>Hint: hvorfor én selector per verdi?</summary>

`const { secondsPerQuestion, showCategory } = useSettingsStore()` abonnerer på hele storen, så komponenten rendres når hva som helst i den endrer seg. Med én selector per verdi rendres den bare når akkurat den verdien endrer seg.
</details>

<details>
<summary>Hint: persist</summary>

```ts
import { persist } from "zustand/middleware";

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({ /* som før */ }),
    { name: "quiz.settings" },
  ),
);
```
</details>

**Tenk over:** Bør spillernavnet også huskes mellom besøk? Hva med en påbegynt quiz?

---

## Nivå 2 – Flytt spillet ut av Context

**Mål:** `QuizContext` er borte. Spillet ligger i en Zustand-store, og hver komponent henter bare det den trenger.

**Hvorfor:** Her ser du forskjellen tydeligst: i dag rendres hele appen for hvert tastetrykk i navnefeltet. Etterpå rendres bare det som viser navnet.

**Ferdig når:** Det finnes ingen `QuizContext` eller `QuizProvider`, spillet virker som før, og når du skriver inn spillernavnet, blinker ikke spørsmålslisten.

1. Lag en store for spillet i `src/stores/quizStore.ts`, med `game` og funksjonene som endrer det.
2. Ikke legg spørsmålene i storen. De kommer fra serveren, og i økt 4 hentes de med TanStack Query.
3. Ikke lagre poengsummen i storen heller. Den kan regnes ut fra spørsmålene og svarene.
4. Flytt spillernavnet til en egen liten store, slik foreleseren gjorde i demoen.
5. Bytt `useQuizContext()` med selectors fra storene, og slett `src/context/QuizContext.tsx`.

<details>
<summary>Hint: når spørsmålene ikke ligger i storen</summary>

`next` må vite hvor mange spørsmål det er. Gi den antallet som parameter. Poengsummen kan du regne ut i en liten hook, `useScore(questions)`, som leser svarene fra storen.
</details>

<details>
<summary>Hint: handlinger som trenger nåværende state</summary>

Zustand gir deg `get` i tillegg til `set`:

```ts
export const useQuizStore = create<QuizStore>()((set, get) => ({
  game: { phase: "lobby" },
  answer: (choice) => {
    const { game } = get();
    if (game.phase !== "question") return;
    set({ game: { phase: "reveal", index: game.index, answers: [...game.answers, choice] } });
  },
  // ...
}));
```
</details>

<details>
<summary>Hint: appen henger seg, eller React advarer om «getSnapshot»</summary>

En selector må gi samme verdi når ingenting har endret seg. `(s) => s.game.phase === "lobby" ? [] : s.game.answers` lager en ny tom liste hver gang. Lag én tom liste utenfor selectoren, og returner den.

Det samme gjelder `(s) => ({ start: s.start, next: s.next })`. Bruk én selector per verdi, eller `useShallow` fra `zustand/react/shallow`.
</details>

---

## Ekstra

### A – Test storen

**Mål:** Spillogikken i `quizStore` er testet.

**Ferdig når:** `npm test` kjører minst tre tester for `quizStore`.

1. Lag `src/stores/quizStore.test.ts`. En store kan testes uten React: kall handlingene og les state med `getState()`.
2. Nullstill storen før hver test, så testene ikke påvirker hverandre.

<details>
<summary>Hint: en test</summary>

```ts
beforeEach(() => {
  useQuizStore.setState({ game: { phase: "lobby" } });
});

it("starter på første spørsmål", () => {
  useQuizStore.getState().start();
  expect(useQuizStore.getState().game).toEqual({ phase: "question", index: 0, answers: [] });
});
```
</details>

### B – Bygg noe eget

Bruk storene til å legge til noe nytt i quizen. Det finnes ingen fasit. Vis gjerne fram det du laget i oppsummeringen. Noen ideer:

- **Mørk modus.** En ny innstilling som huskes, og som hele appen bruker.
- **Beste resultat.** Husk spillerens beste resultat mellom besøk, og vis det på startskjermen.
- **Vanskelighetsgrad.** En innstilling som gir færre sekunder per spørsmål. Hvor bør den ligge?
