import { useEffect, useState } from "react";
import { fetchQuestions } from "../api/questions";

// Tre separate verdier som til sammen beskriver lastetilstanden.
// (Dette byttes ut med én LoadState i live-demoen.)
export function useQuestions() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any[] | null>(null);

  useEffect(() => {
    fetchQuestions()
      .then((questions) => setData(questions))
      .catch((e: any) => setError(e.message))
      .finally(() => setIsLoading(false));
  }, []);

  return { isLoading, error, data };
}
