import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchLeaderboard, postResult } from "../api/leaderboard";

const LEADERBOARD_KEY = ["leaderboard"] as const;

// Live-demo: topplista med useQuery.
// Ekstra A: throwOnError sender feilen videre til nærmeste Error Boundary.
export function useLeaderboard() {
  return useQuery({
    queryKey: LEADERBOARD_KEY,
    queryFn: fetchLeaderboard,
    throwOnError: true,
  });
}

// Nivå 2: lagre et resultat. Når det er lagret, er topplista utdatert, så vi ber om at den hentes på nytt.
export function useSaveResult() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postResult,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: LEADERBOARD_KEY }),
  });
}
