import { create } from "zustand";
import { persist } from "zustand/middleware";

// Innstillingene. persist lagrer dem i localStorage, så de huskes mellom besøk.
type SettingsStore = {
  secondsPerQuestion: number;
  showCategory: boolean;
  setSecondsPerQuestion: (seconds: number) => void;
  toggleShowCategory: () => void;
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      secondsPerQuestion: 20,
      showCategory: true,
      setSecondsPerQuestion: (seconds) => set({ secondsPerQuestion: seconds }),
      toggleShowCategory: () => set((s) => ({ showCategory: !s.showCategory })),
    }),
    { name: "quiz.settings" },
  ),
);
