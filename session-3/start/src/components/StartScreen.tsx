import { useQuizContext } from "../context/QuizContext";
import type { Question } from "../types";
import { List } from "./List";
import { SettingsPanel } from "./SettingsPanel";

type Props = {
  questions: Question[];
};

export function StartScreen({ questions }: Props) {
  const { playerName, setPlayerName, start } = useQuizContext();

  return (
    <section className="card">
      <h2>Klar for quiz?</h2>
      <label className="player-name">
        Navnet ditt
        <input value={playerName} onChange={(e) => setPlayerName(e.target.value)} placeholder="Gjest" />
      </label>
      <SettingsPanel />
      <p>{questions.length} spørsmål i denne runden:</p>
      <List className="question-list" items={questions} getKey={(q) => q.id} render={(q) => q.text} />
      <button className="primary" onClick={start}>
        Start quiz
      </button>
    </section>
  );
}
