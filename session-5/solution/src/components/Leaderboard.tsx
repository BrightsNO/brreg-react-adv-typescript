import type { LeaderboardEntry } from "../types";

type Props = {
  entries: LeaderboardEntry[];
};

// Ferdig UI for topplista. Den henter ingenting selv: du sender inn radene.
export function Leaderboard({ entries }: Props) {
  if (entries.length === 0) {
    return <p className="leaderboard-empty">Ingen resultater ennå.</p>;
  }

  return (
    <ol className="leaderboard">
      {entries.map((entry) => (
        <li key={entry.playedAt + entry.name}>
          <span>{entry.name}</span>
          <span>
            {entry.score} / {entry.total}
          </span>
        </li>
      ))}
    </ol>
  );
}
