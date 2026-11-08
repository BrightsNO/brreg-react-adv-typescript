import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";

// npm run analyze bygger appen og åpner en oversikt over hva bundlen består av (dist/stats.html).
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    mode === "analyze" && visualizer({ filename: "dist/stats.html", open: true, gzipSize: true }),
  ],
  test: {
    environment: "node",
  },
}));
