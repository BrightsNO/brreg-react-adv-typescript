import { useQueryErrorResetBoundary } from "@tanstack/react-query";
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";
import { useLeaderboard } from "../hooks/useLeaderboard";
import { ErrorMessage } from "./ErrorMessage";
import { Leaderboard } from "./Leaderboard";

// Ekstra A: Error Boundary rundt topplista. Feiler topplista, vises en melding her,
// mens resten av appen virker som før.
export function LeaderboardSection() {
  const { reset } = useQueryErrorResetBoundary();
  return (
    <section>
      <h3>Toppliste</h3>
      <ErrorBoundary onReset={reset} FallbackComponent={LeaderboardFallback}>
        <LeaderboardContent />
      </ErrorBoundary>
    </section>
  );
}

function LeaderboardContent() {
  const leaderboard = useLeaderboard();
  if (leaderboard.status === "pending") return <p className="leaderboard-empty">Laster topplista …</p>;
  // Med throwOnError havner feil i Error Boundary-en, så hit kommer vi bare ved success.
  if (leaderboard.status === "error") return null;
  return <Leaderboard entries={leaderboard.data} />;
}

function LeaderboardFallback({ resetErrorBoundary }: FallbackProps) {
  return <ErrorMessage message="Topplista er ikke tilgjengelig akkurat nå." onRetry={resetErrorBoundary} />;
}
