import { QuizGame } from "./QuizGame";

export function App() {
  return (
    <main className="app">
      <header className="app-header">
        <h1>Quiz</h1>
        <p>React &amp; TypeScript i praksis</p>
      </header>
      <QuizGame />
      <footer className="app-footer">Versjon {import.meta.env.VITE_APP_VERSION}</footer>
    </main>
  );
}
