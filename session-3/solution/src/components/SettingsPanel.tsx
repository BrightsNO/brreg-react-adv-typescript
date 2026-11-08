import { useSettingsStore } from "../stores/settingsStore";

export function SettingsPanel() {
  // Én selector per verdi. Hver av dem gir en stabil verdi, så ingen unødvendige renderinger.
  const secondsPerQuestion = useSettingsStore((s) => s.secondsPerQuestion);
  const showCategory = useSettingsStore((s) => s.showCategory);
  const setSecondsPerQuestion = useSettingsStore((s) => s.setSecondsPerQuestion);
  const toggleShowCategory = useSettingsStore((s) => s.toggleShowCategory);

  return (
    <fieldset className="settings">
      <legend>Innstillinger</legend>
      <label>
        Sekunder per spørsmål
        <select value={secondsPerQuestion} onChange={(e) => setSecondsPerQuestion(Number(e.target.value))}>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={30}>30</option>
        </select>
      </label>
      <label>
        <input type="checkbox" checked={showCategory} onChange={toggleShowCategory} />
        Vis kategori
      </label>
    </fieldset>
  );
}
