import { useQuizContext } from "../context/QuizContext";

export function SettingsPanel() {
  const { settings, setSettings } = useQuizContext();

  return (
    <fieldset className="settings">
      <legend>Innstillinger</legend>
      <label>
        Sekunder per spørsmål
        <select
          value={settings.secondsPerQuestion}
          onChange={(e) => setSettings({ ...settings, secondsPerQuestion: Number(e.target.value) })}
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={30}>30</option>
        </select>
      </label>
      <label>
        <input
          type="checkbox"
          checked={settings.showCategory}
          onChange={(e) => setSettings({ ...settings, showCategory: e.target.checked })}
        />
        Vis kategori
      </label>
    </fieldset>
  );
}
