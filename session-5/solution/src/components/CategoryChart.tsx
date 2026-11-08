import { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";
import { CATEGORIES, type ScoreByCategory } from "../types";

Chart.register(...registerables);

type Props = {
  scores: ScoreByCategory;
};

// Diagram over poeng per kategori, laget med chart.js.
// chart.js er et stort bibliotek. Se hvor mye av bundlen det utgjør med npm run analyze.
export default function CategoryChart({ scores }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // chart.js tegner på et canvas-element utenfor React, så her er en effect riktig verktøy (økt 2).
  useEffect(() => {
    if (!canvasRef.current) return;
    const chart = new Chart(canvasRef.current, {
      type: "bar",
      data: {
        labels: [...CATEGORIES],
        datasets: [
          { label: "Riktige", data: CATEGORIES.map((c) => scores[c].correct), backgroundColor: "#a741fa" },
          { label: "Totalt", data: CATEGORIES.map((c) => scores[c].total), backgroundColor: "#f2ceff" },
        ],
      },
      options: { responsive: true, scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } } },
    });
    return () => chart.destroy();
  }, [scores]);

  return <canvas ref={canvasRef} aria-label="Poeng per kategori" />;
}
