import LeaderboardTrigger from "@/components/game/LeaderboardTrigger";
import RankSummary from "@/components/game/RankSummary";
import { pluralize } from "@/lib/game/format";
import type { LobbyRow } from "@/lib/game/lobby";

type Props = {
  /** The player's leaderboard row. */
  row: LobbyRow;
  /** Their position on the leaderboard, from 1. */
  position: number;
  playerCount: number;
};

/** The player's place on the leaderboard and their progress, under their grid: tapping it opens the leaderboard. */
export default function PlayerRank({ row, position, playerCount }: Props) {
  return (
    <LeaderboardTrigger
      aria-label={`You're ${position} of ${pluralize(playerCount, "player")}: open the leaderboard`}
      className="cursor-pointer rounded-xl bg-card px-6 py-4 transition-transform active:scale-[0.98]"
    >
      <RankSummary row={row} position={position} playerCount={playerCount} />
    </LeaderboardTrigger>
  );
}
