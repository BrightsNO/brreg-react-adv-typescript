# Økt 2: Hooks – oppgaver

Du har 90 minutter. Det er to nivåer, og to ekstraoppgaver for dem som blir ferdige. Alle starter på nivå 1. Det er helt greit å bare bli ferdig med nivå 1.

`session-2/start` bygger på løsningen fra økt 1, men med tre unødvendige `useEffect`-er lagt inn med vilje. Nedtellingen fra demoen er ikke med. Vil du ha den, kopierer du `src/hooks/useCountdown.ts` fra `session-2/solution`.

| Tid | Hva |
| --- | --- |
| 0–10 min | Kom i gang: start prosjektet og les oppgaven |
| 10–45 min | Nivå 1 |
| 45–80 min | Nivå 2, og ekstraoppgavene hvis du har tid |
| 80–90 min | Felles oppsummering |

## Kom i gang

```bash
cd session-2/start
npm install
npm run dev
```

Sjekk arbeidet ditt med `npm run typecheck`, `npm run lint` og `npm test`. Cheatsheetet ligger i `session-2/cheatsheet.md`.

## Står du fast?

1. Les «Ferdig når» på nytt.
2. Åpne hintet for det du står fast på. Det gir deg retningen.
3. Står du fortsatt fast, åpne «Vis koden» inne i hintet.
4. Se i `session-2/solution`.

Det er helt greit å jobbe to og to.

---

## Nivå 1 – Rydd bort effects, og vis lengste rekke

**Mål:** De tre unødvendige effectene er borte, og resultatskjermen viser den lengste rekken med riktige svar på rad.

**Hvorfor:** En effect som oppdaterer state ut fra annen state, gir en ekstra rendering og er lett å få feil. Det meste kan regnes ut under rendering, eller skje i en event-handler. Lengste rekke er en ny verdi av samme sort: den kan regnes ut fra svarene.

**Ferdig når:**
- Det finnes ingen `useEffect` i `ResultScreen.tsx` eller `QuestionCard.tsx`.
- `npm run lint` gir verken feil eller advarsler.
- Resultatskjermen viser for eksempel «Lengste rekke: 3 riktige på rad».

1. Finn de tre effectene. Spør for hver av dem, som i beslutningstreet:
   - Kan verdien regnes ut fra props eller state?
   - Skjer det fordi brukeren gjorde noe?
   - Skal noe nullstilles når et prop endres?
2. Fjern dem, én om gangen, og sjekk at appen virker etter hver.
3. Lag `longestStreak(questions, answers)` i `src/game/scoring.ts`, og vis resultatet på resultatskjermen.
4. Skriv gjerne en test for `longestStreak` i `scoring.test.ts`.

<details>
<summary>Hint: ResultScreen</summary>

`score` og `byCategory` kan regnes ut fra `questions` og `answers`, som komponenten allerede har. Trenger de å ligge i state?

<details>
<summary>Vis koden</summary>

```ts
const score = countCorrect(questions, answers);
const byCategory = scoreByCategory(questions, answers);
```

Du trenger verken `useState` eller `useEffect`.
</details>
</details>

<details>
<summary>Hint: QuestionCard</summary>

Hva skjer når brukeren klikker på et svar, og hvem må få vite det? Og hvis komponenten skal starte på nytt for hvert spørsmål, finnes det en enklere måte enn å nullstille state i en effect.

<details>
<summary>Vis koden</summary>

Kall `onAnswer(i)` rett i `onClick`. Da trenger du ikke `clicked`, og heller ikke effecten som nullstiller den. Gi komponenten en `key` i `QuizGame.tsx`, så starter den på nytt for hvert spørsmål:

```tsx
<QuestionCard key={questions[game.index].id} ... />
```
</details>
</details>

<details>
<summary>Hint: lengste rekke</summary>

Gå gjennom spørsmålene ett for ett. Hold styr på hvor mange riktige du har på rad nå, og den lengste rekken så langt. Et feil svar nullstiller rekken.

<details>
<summary>Vis koden</summary>

```ts
export function longestStreak(questions: Question[], answers: number[]): number {
  let longest = 0;
  let current = 0;
  questions.forEach((q, i) => {
    current = isCorrect(q, answers[i]) ? current + 1 : 0;
    longest = Math.max(longest, current);
  });
  return longest;
}
```
</details>
</details>

**Tenk over:** Hvorfor er det bedre å regne ut lengste rekke på resultatskjermen enn å lagre den i state og oppdatere den for hvert svar?

---

## Nivå 2 – Svar med tastene 1–4

**Mål:** Spilleren kan svare med tastene 1–4 i stedet for å klikke.

**Hvorfor:** Tastaturet er noe utenfor React. Det er en ekte grunn til å bruke en effect, og glemt opprydding er den vanligste feilen med effects.

**Ferdig når:** Tastene velger riktig svar, de virker ikke etter at svaret er gitt, og lytteren fjernes når komponenten forsvinner.

1. I `QuestionCard.tsx`: lytt på `keydown` på `window` i en `useEffect`.
2. Gjør tasten om til et svar, og ignorer taster som ikke passer til et alternativ.
3. Rydd opp når effecten ikke trengs lenger.
4. Sørg for at tastene ikke virker etter at svaret er gitt.
5. Vis tallet foran hvert alternativ. CSS-klassen `option-key` ligger klar.

<details>
<summary>Hint: lytteren</summary>

`addEventListener` i effecten, og `removeEventListener` i funksjonen effecten returnerer. Tasten `"1"` skal bli indeks `0`.

<details>
<summary>Vis koden</summary>

```ts
useEffect(() => {
  function onKeyDown(e: KeyboardEvent) {
    const i = Number(e.key) - 1;
    if (i >= 0 && i < question.options.length) onAnswer(i);
  }
  window.addEventListener("keydown", onKeyDown);
  return () => window.removeEventListener("keydown", onKeyDown);
}, [question.options.length, onAnswer]);
```
</details>
</details>

<details>
<summary>Hint: tastene virker fortsatt etter svaret</summary>

La effecten avhenge av om svaret er vist, og returner tidlig uten å legge til en lytter når det er det. Når verdien endrer seg, rydder React opp den gamle lytteren og kjører effecten på nytt.
</details>

**Tenk over:** Fjern oppryddingen en liten stund, og legg til en `console.log` i lytteren. Svar på tre spørsmål med tastene. Hvor mange ganger logges det for hvert tastetrykk, og hvorfor?

---

## Ekstra

### A – Trekk spillogikken ut i useQuiz

**Mål:** All spillogikken i `QuizGame.tsx` ligger i en egen hook, og komponenten er nesten bare JSX.

**Ferdig når:** `QuizGame.tsx` inneholder ingen `useState` eller spillfunksjoner, og spillet virker som før.

1. Lag `src/hooks/useQuiz.ts`, og flytt `useState<GameState>`, `start`, `answer` og `next` dit.
2. Regn ut poengsummen i hooken, ikke som state, og returner det komponenten trenger.
3. Bruk hooken i `QuizGame.tsx`, og vis poengsummen underveis i spillet.

<details>
<summary>Hint: hva hooken returnerer</summary>

```ts
export function useQuiz(questions: Question[]) {
  const [game, setGame] = useState<GameState>({ phase: "lobby" });
  const score = game.phase === "lobby" ? 0 : countCorrect(questions, game.answers);
  // start, answer, next ...
  return { game, score, start, answer, next };
}
```
</details>

### B – Bygg noe eget

Bruk det du lærte i dag til å legge til noe nytt i quizen. Det finnes ingen fasit. Vis gjerne fram det du laget i oppsummeringen. Noen ideer:

- **Rekken underveis.** Vis hvor mange riktige spilleren har på rad mens spillet pågår.
- **Bonus for raske svar.** Kopier `useCountdown` fra løsningen, og gi ekstra poeng for tid som er igjen.
- **Hopp over.** En knapp, eller tasten Escape, som hopper over et spørsmål og teller det som feil.
