import { useEffect, useState } from "react";
import { fetchQuestions } from "../api/questions";
import type { LoadState, Question } from "../types";

// Én LoadState i stedet for isLoading, error og data.
export function useQuestions(): LoadState<Question[]> {
  const [state, setState] = useState<LoadState<Question[]>>({ status: "loading" });

  useEffect(() => {
    fetchQuestions()
      .then((data) => setState({ status: "success", data }))
      .catch((e: unknown) =>
        setState({ status: "error", error: e instanceof Error ? e.message : "Ukjent feil" }),
      );
  }, []);

  return state;
}
