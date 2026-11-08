import { create } from "zustand";

// Live-demo: spillernavnet i en egen liten store.
type PlayerStore = {
  name: string;
  setName: (name: string) => void;
};

export const usePlayerStore = create<PlayerStore>()((set) => ({
  name: "",
  setName: (name) => set({ name }),
}));
