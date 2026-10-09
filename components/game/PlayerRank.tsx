import LeaderboardTrigger from "@/components/game/LeaderboardTrigger";
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

/** The player's place on the leaderboard and their progress, under their grid: tapping it opens the leaderboard. */
export default function PlayerRank({ row, position, playerCount }: Props) {
  const rank = rankLabel(row, position);
  const rankText = typeof rank === "number" ? `#${rank}` : rank;
  const hasBingo = row.bingoRank !== null;
  return (
    <LeaderboardTrigger
      aria-label={`You're ${rankText} of ${pluralize(playerCount, "player")}: open the leaderboard`}
      className="flex cursor-pointer items-center gap-4 rounded-2xl bg-card px-4 py-3 transition-transform active:scale-[0.98]"
    >
      <span className="font-heading text-4xl">{rankText}</span>
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
    </LeaderboardTrigger>
  );
}
