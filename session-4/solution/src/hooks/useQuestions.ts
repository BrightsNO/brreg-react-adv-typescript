import { useQuery } from "@tanstack/react-query";
import { fetchQuestions } from "../api/questions";

// Nivå 1: TanStack Query i stedet for vår egen LoadState-hook.
// Vi får cache, nytt forsøk ved feil og status ("pending" | "error" | "success") gratis.
export function useQuestions() {
  return useQuery({
    queryKey: ["questions"],
    queryFn: fetchQuestions,
    // Spørsmålene endres ikke mens man spiller, så de trenger ikke hentes på nytt.
    staleTime: Infinity,
  });
}
