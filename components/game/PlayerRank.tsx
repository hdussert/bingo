import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { pluralize } from "@/lib/game/format";
import { type LobbyRow, rankLabel } from "@/lib/game/lobby";
import { cn } from "@/lib/utils";

type Props = {
  /** The player's leaderboard row. */
  row: LobbyRow;
  /** Their position on the leaderboard, from 1. */
  position: number;
  playerCount: number;
};

/** The player's place on the leaderboard and their progress, under their grid. */
export default function PlayerRank({ row, position, playerCount }: Props) {
  const rank = rankLabel(row, position);
  const hasBingo = row.bingoRank !== null;
  return (
    <div className="flex items-center gap-4 rounded-2xl bg-card px-4 py-3">
      <span className="font-heading text-4xl">
        {typeof rank === "number" ? `#${rank}` : rank}
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <span className="text-muted-foreground">
            of {pluralize(playerCount, "player")}
          </span>
          <Badge
            className={cn(hasBingo && "bg-highlight text-highlight-foreground")}
            variant={hasBingo ? "default" : "outline"}
          >
            {pluralize(row.lineCount, "line")}
          </Badge>
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
