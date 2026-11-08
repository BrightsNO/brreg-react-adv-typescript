# Cheatsheet – Økt 2: Hooks

## Begreper

| Begrep | Kort forklart |
| --- | --- |
| Rendering | React kjører komponenten (funksjonen) på nytt når state eller props endres. |
| State | En verdi som huskes mellom renderinger. Endrer du den, rendres komponenten på nytt. |
| Utledet verdi | En verdi som kan regnes ut fra props eller state. Den trenger verken egen state eller effect. |
| Effect | Kode som kjører etter rendering, for å holde komponenten synkronisert med noe utenfor React. |
| Opprydding (cleanup) | Funksjonen du returnerer fra en effect. Den kjøres før effecten kjører på nytt, og når komponenten forsvinner. |
| Avhengighetsliste | Listen til slutt i `useEffect`. Effecten kjører på nytt når en av verdiene endres. |
| Stale closure | En funksjon som fortsatt ser en gammel verdi, fordi den ble laget i en tidligere rendering. |
| Ref | En verdi som huskes mellom renderinger, men som ikke gir ny rendering når den endres. |
| Egen hook | En vanlig funksjon som bruker andre hooks. Navnet starter med `use`. |
| Memoisering | Å huske et resultat mellom renderinger, så det ikke regnes ut på nytt (`useMemo`, `useCallback`). |

## Trenger du en effect?

Still spørsmålene i rekkefølge, og bruk det første som passer:

1. Kan verdien regnes ut fra props eller state? → Regn den ut under rendering.
2. Skjer det fordi brukeren gjorde noe? → Gjør det i event-handleren.
3. Skal verdien huskes uten ny rendering? → `useRef`.
4. Må komponenten holde seg synkronisert med noe utenfor React? → `useEffect`.

Datahenting gjør vi med TanStack Query (økt 4), ikke med egne effects.

## Mønstre

### Utledet verdi

```ts
// Ikke slik:
const [score, setScore] = useState(0);
useEffect(() => setScore(countCorrect(questions, answers)), [questions, answers]);

// Men slik:
const score = countCorrect(questions, answers);
```

### Effect med opprydding

```ts
useEffect(() => {
  const id = setInterval(() => setSecondsLeft((s) => Math.max(s - 1, 0)), 1000);
  return () => clearInterval(id);
}, []);
```

### Lytte på noe utenfor React

```ts
useEffect(() => {
  function onKeyDown(e: KeyboardEvent) { /* ... */ }
  window.addEventListener("keydown", onKeyDown);
  return () => window.removeEventListener("keydown", onKeyDown);
}, []);
```

### Avbryte en henting (race condition)

```ts
useEffect(() => {
  const controller = new AbortController();
  fetchQuestions(category, controller.signal).then(setQuestions);
  return () => controller.abort();
}, [category]);
```

### Egen hook

```ts
export function useCountdown(seconds: number): number {
  const [left, setLeft] = useState(seconds);
  useEffect(() => {
    const id = setInterval(() => setLeft((s) => Math.max(s - 1, 0)), 1000);
    return () => clearInterval(id);
  }, []);
  return left;
}

// I komponenten:
const secondsLeft = useCountdown(20);
```

Hooks deler logikk, ikke state. To komponenter som kaller `useCountdown`, får hver sin nedtelling.

### Start en komponent på nytt med `key`

```tsx
<QuestionCard key={question.id} question={question} />
```

Ny `key` gir en ny komponent, med ny state. Da slipper du en effect som nullstiller state når et prop endres.

### Husk siste versjon av en callback

```ts
const onDoneRef = useRef(onDone);
useEffect(() => {
  onDoneRef.current = onDone;
});
```

Da kan en effect kalle `onDoneRef.current()` uten å ha `onDone` i avhengighetslisten.

## Vanlige feil

| Unngå | Bruk heller |
| --- | --- |
| State og effect for noe som kan regnes ut | En vanlig variabel |
| En effect som reagerer på et klikk | Kall funksjonen rett i `onClick` |
| En effect som nullstiller state når et prop endres | `key` på komponenten |
| `setInterval` eller `addEventListener` uten opprydding | Returner en funksjon som stopper eller fjerner dem |
| `setLeft(left - 1)` i en effect med `[]` | `setLeft((s) => s - 1)` |
| Å slå av `react-hooks/exhaustive-deps` | Forstå hva den sier, og rett koden |
| `useMemo` og `useCallback` rundt alt | Skriv enkelt først, og mål før du optimaliserer |

## Les mer

- [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect) på react.dev
- [Synchronizing with Effects](https://react.dev/learn/synchronizing-with-effects) på react.dev
- [Reusing Logic with Custom Hooks](https://react.dev/learn/reusing-logic-with-custom-hooks) på react.dev
