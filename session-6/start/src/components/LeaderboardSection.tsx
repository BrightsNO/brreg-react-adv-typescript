import { useQueryErrorResetBoundary } from "@tanstack/react-query";
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";
import { useLeaderboard } from "../hooks/useLeaderboard";
import { reportError } from "../monitoring";
import { ErrorMessage } from "./ErrorMessage";
import { Leaderboard } from "./Leaderboard";

// Error Boundary rundt topplista. Feiler topplista, vises en melding her,
// mens resten av appen virker som før.
export function LeaderboardSection() {
  const { reset } = useQueryErrorResetBoundary();
  // Feil under rendering rapporteres via onError. Feil fra selve spørringen rapporteres også
  // av QueryCache (se src/queryClient.ts), så de kan komme to ganger (økt 5).
  return (
    <section>
      <h3>Toppliste</h3>
      <ErrorBoundary
        onReset={reset}
        onError={(error) => reportError(error, { kilde: "error-boundary", del: "toppliste" })}
        FallbackComponent={LeaderboardFallback}
      >
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
