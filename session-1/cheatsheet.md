# Cheatsheet – Økt 1: Avansert TypeScript

## Begreper

| Begrep | Kort forklart |
| --- | --- |
| Type | Beskriver formen på en verdi, for eksempel hvilke felt et objekt har. |
| Union | En verdi som kan være én av flere typer: `"idle" \| "loading"`. |
| Narrowing | TypeScript snevrer inn typen etter en sjekk. Inne i `if`-blokken vet den mer enn utenfor. |
| Type guard | En funksjon som sjekker en verdi og forteller TypeScript hva den er: `x is Question`. |
| Discriminated union | En union der alle variantene har et felles felt (for eksempel `status`) som sier hvilken variant det er. |
| `never` | En type som aldri kan forekomme. Brukes som sikkerhetsnett i `switch`. |
| Generics | En typeparameter, `<T>`, som lar en funksjon eller komponent virke for mange typer uten å miste typen. |
| Utility types | Innebygde typer som lager en ny type ut fra en du har: `Pick`, `Omit`, `Partial`, `Record` osv. |
| `unknown` | «Jeg vet ikke hva dette er ennå.» Du må sjekke verdien før du kan bruke den. |
| `any` | Slår av typesjekken. Alt godtas, også feil. |

`type` eller `interface`? Begge beskriver objekter. Bruk `type` som standard: den kan også beskrive unions. Bruk `interface` hvis andre skal kunne utvide typen med `extends`.

## Mønstre

### Narrowing

```ts
if (typeof x === "string") { /* x er string */ }
if ("text" in x) { /* x har feltet text */ }
if (state.status === "error") { /* state er error-varianten */ }
```

### Type guard

```ts
function isQuestion(x: unknown): x is Question {
  return (
    typeof x === "object" && x !== null &&
    "text" in x && typeof x.text === "string"
    // ... sjekk resten av feltene
  );
}
```

### Discriminated union med sikkerhetsnett

```ts
type LoadState =
  | { status: "loading" }
  | { status: "success"; data: Question[] }
  | { status: "error"; error: string };

switch (state.status) {
  case "loading": return <Spinner />;
  case "success": return <List items={state.data} />;
  case "error":   return <Message>{state.error}</Message>;
  default: {
    const unhandled: never = state; // feiler hvis en status ikke er håndtert
    return unhandled;
  }
}
```

### Generics

```ts
function first<T>(xs: T[]): T | undefined {
  return xs[0];
}

function findById<T extends { id: string }>(xs: T[], id: string) {
  return xs.find((x) => x.id === id);
}
```

### Utility types

| Type | Hva den gjør |
| --- | --- |
| `Partial<T>` | Alle felt blir valgfrie |
| `Required<T>` | Alle felt blir påkrevde |
| `Pick<T, "a" \| "b">` | Bare feltene `a` og `b` |
| `Omit<T, "a">` | Alle felt unntatt `a` |
| `Record<K, V>` | Et objekt med nøkler av typen `K` og verdier av typen `V` |
| `Readonly<T>` | Alle felt blir `readonly` |
| `ReturnType<typeof fn>` | Typen en funksjon returnerer |

### Avled typer i stedet for å skrive dem dobbelt

```ts
const CATEGORIES = ["react", "typescript", "web"] as const;
type Category = (typeof CATEGORIES)[number]; // "react" | "typescript" | "web"

type Key = keyof Question;   // "id" | "text" | ...
type Text = Question["text"]; // string
```

### Mapped types

Slik er utility types bygd:

```ts
type MyPartial<T> = { [K in keyof T]?: T[K] };
type ScoreByCategory = { [C in Category]: number };
```

### Les data fra API-et trygt

```ts
const data: unknown = await res.json();
if (!isQuestionList(data)) {
  throw new Error("Svaret fra API-et hadde ikke formen vi forventet");
}
return data; // Question[]
```

## Vanlige feil

| Unngå | Bruk heller |
| --- | --- |
| `any` | `unknown`, og sjekk før bruk |
| `const data = await res.json()` | `const data: unknown = await res.json()`. `res.json()` gir `any` uten at du ser det. |
| `data as Question[]` | En type guard, eller validering med Zod (økt 4) |
| `verdi!` | En sjekk: `if (verdi) { ... }` |
| `isLoading`, `error` og `data` som tre separate verdier | Én discriminated union |
| `// @ts-ignore` | Rett feilen, eller `// @ts-expect-error` med en forklaring |

Husk: TypeScript sjekker koden du skriver. Validering sjekker dataene du mottar.

## Les mer

- [Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html) i TypeScript-håndboken
- [Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html) i TypeScript-håndboken
- [Utility Types](https://www.typescriptlang.org/docs/handbook/utility-types.html) i TypeScript-dokumentasjonen
