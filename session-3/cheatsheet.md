# Cheatsheet – Økt 3: Hvor bor staten?

## Begreper

| Begrep | Kort forklart |
| --- | --- |
| Props | Data som sendes inn i en komponent fra forelderen. Komponenten endrer dem ikke selv. |
| State | Data komponenten selv eier og kan endre. En endring gir ny rendering. |
| Løfte state opp | Flytte state til nærmeste felles forelder, og sende den ned med props. |
| Prop drilling | Å sende props gjennom mange lag som ikke selv bruker dem. |
| Context | Sender en verdi nedover i treet, uten props gjennom hvert lag. Har ingen selectors. |
| Server-state | Data som eies av serveren, for eksempel spørsmålene. Hører hjemme i TanStack Query (økt 4). |
| Klient-state | State som bare finnes i nettleseren, for eksempel spillfasen og innstillingene. |
| Store | En egen beholder for delt state, utenfor komponenttreet. I kurset bruker vi Zustand. |
| Selector | En funksjon som plukker ut den delen av storen komponenten trenger: `(s) => s.name`. |

## Hvor hører staten hjemme?

Still spørsmålene i rekkefølge, og bruk det første som passer:

| Spørsmål | Svar |
| --- | --- |
| Kan verdien regnes ut? | Den er ikke state. Regn den ut. |
| Brukes den bare i én komponent? | `useState` |
| Trenger flere komponenter med samme forelder den? | Løft den opp |
| Skal den overleve at siden lastes på nytt, eller deles som lenke? | URL-en |
| Kommer den fra serveren? | TanStack Query (økt 4) |
| Endres den sjelden, men trengs overalt? | Context |
| Er den delt, og endres den ofte? | En store (Zustand) |

## Context

Context har ingen selectors. Når verdien endres, rendres alle som kaller `useContext`, uansett hvilken del de bruker. React sammenligner verdien med `Object.is`, så et nytt objekt i `value` er alltid «endret».

Det er som regel billig. Det koster mer jo oftere verdien endres, jo flere som leser den, og jo dyrere hver rendering er. Mål i React DevTools Profiler før du optimaliserer.

**Godt bruk:** tema, språk, innlogget bruker, Context som bare gjelder én del av treet (for eksempel en `Tabs`-komponent), og tjenester som skal kunne byttes ut i tester.

**Dårlig bruk:** data fra serveren, og én stor `AppContext` med alt.

### Prop drilling uten Context: komposisjon

```tsx
// I stedet for å sende user gjennom Layout og Sidebar:
<Layout sidebar={<UserMenu user={user} />}>
  <Page />
</Layout>
```

### `useReducer` + Context: del i to

```tsx
const StateContext = createContext<State | null>(null);
const DispatchContext = createContext<Dispatch<Action> | null>(null);
```

`dispatch` endres aldri, så komponenter som bare sender handlinger, rendres ikke på nytt.

## Zustand

Storen ligger utenfor React. Komponenten abonnerer på den, og rendres bare når selectoren gir en ny verdi (sammenlignet med `Object.is`).

### En store

```ts
import { create } from "zustand";

type PlayerStore = {
  name: string;
  setName: (name: string) => void;
};

export const usePlayerStore = create<PlayerStore>()((set) => ({
  name: "",
  setName: (name) => set({ name }),
}));
```

Legg merke til de to parentesene i `create<PlayerStore>()(...)`. Det er slik Zustand vil ha det med TypeScript.

### Handlinger som trenger nåværende state

```ts
export const useQuizStore = create<QuizStore>()((set, get) => ({
  game: { phase: "lobby" },
  answer: (choice) => {
    const { game } = get();
    if (game.phase !== "question") return;
    set({ game: { phase: "reveal", index: game.index, answers: [...game.answers, choice] } });
  },
}));
```

### Selectors

```ts
const name = usePlayerStore((s) => s.name);       // én verdi
const setName = usePlayerStore((s) => s.setName);
```

Flere verdier i én selector? Bruk `useShallow`, ellers er objektet nytt hver gang:

```ts
import { useShallow } from "zustand/react/shallow";

const { name, setName } = usePlayerStore(useShallow((s) => ({ name: s.name, setName: s.setName })));
```

### Husk mellom besøk

```ts
import { persist } from "zustand/middleware";

export const useSettingsStore = create<SettingsStore>()(
  persist((set) => ({ /* ... */ }), { name: "quiz.settings" }),
);
```

### Test en store uten React

```ts
beforeEach(() => useQuizStore.setState({ game: { phase: "lobby" } }));

it("starter på første spørsmål", () => {
  useQuizStore.getState().start();
  expect(useQuizStore.getState().game.phase).toBe("question");
});
```

Storen er global og lever videre mellom tester. Nullstill den i `beforeEach`.

## Zustand eller Redux Toolkit?

| | Zustand | Redux Toolkit |
| --- | --- | --- |
| Oppsett | Lite. Én funksjon og et objekt. | Mer struktur: slices, actions og reducers. |
| Ytelse | Lik. Begge bruker selectors. | Lik. Begge bruker selectors. |
| DevTools | Via middleware | Innebygd, med time travel og middleware |
| Data fra serveren | Sammen med TanStack Query | RTK Query er innebygd |
| Passer når | Små og mellomstore apper | Store team, mange som endrer samme state |

## Vanlige feil

| Unngå | Bruk heller |
| --- | --- |
| Én stor context med alt | Flere små contexter, eller en store |
| `value={{ ... }}` med state som endres ofte | En store med selectors |
| Data fra API-et kopiert inn i en context eller store | TanStack Query (økt 4) |
| Poengsum eller andre utledede verdier i storen | Regn dem ut der de trengs |
| `const { name } = usePlayerStore()` | `usePlayerStore((s) => s.name)` |
| En selector som lager ny liste eller nytt objekt: `(s) => s.x ?? []` | En konstant tom liste utenfor selectoren, eller `useShallow` |
| Tester som påvirker hverandre | Nullstill storen i `beforeEach` |

## Les mer

- [Choosing the State Structure](https://react.dev/learn/choosing-the-state-structure) på react.dev
- [Passing Data Deeply with Context](https://react.dev/learn/passing-data-deeply-with-context) på react.dev
- [Scaling Up with Reducer and Context](https://react.dev/learn/scaling-up-with-reducer-and-context) på react.dev
- [Zustand-dokumentasjonen](https://zustand.docs.pmnd.rs/)
