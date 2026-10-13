import LinesBadge from "@/components/game/LinesBadge";
import RankNumber from "@/components/game/RankNumber";
import { Progress } from "@/components/ui/progress";
import { pluralize } from "@/lib/game/format";
import type { LobbyRow } from "@/lib/game/lobby";

type Props = {
  /** The player's leaderboard row. */
  row: LobbyRow;
  /** Their position on the leaderboard, from 1. */
  position: number;
  playerCount: number;
};

/** A player's place on the leaderboard, their lines and their progress. */
export default function RankSummary({ row, position, playerCount }: Props) {
  return (
    <div className="flex items-center gap-4">
      <RankNumber
        position={position}
        bingoRank={row.bingoRank}
        className="text-4xl"
      />
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <span className="text-muted-foreground">
            of {pluralize(playerCount, "player")}
          </span>
          <LinesBadge
            lineCount={row.lineCount}
            hasBingo={row.bingoRank !== null}
          />
        </div>
        <Progress
          value={row.tickCount}
          max={row.cellCount}
          aria-label={`${row.tickCount} of ${row.cellCount} ticked`}
          className="[&_[data-slot=progress-track]]:h-2"
        />
      </div>
    </div>
  );
}
