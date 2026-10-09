import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { type LobbyRow, rankLabel } from "@/lib/game/lobby";
import { pluralize } from "@/lib/game/format";
import { cn } from "@/lib/utils";

type Props = {
  rows: LobbyRow[];
  /** The current player's name key, to highlight their row. */
  playerKey: string;
};

/** Every player of the game ranked, with their progress, bingos first. */
export default function Lobby({ rows, playerKey }: Props) {
  return (
    <ol className="flex flex-col gap-2">
      {rows.map((row, i) => {
        const isMe = row.nameKey === playerKey;
        const hasBingo = row.bingoRank !== null;
        return (
          <li
            key={row.nameKey}
            className={cn(
              "flex items-center gap-3 rounded-2xl border-2 px-3 py-2.5",
              isMe ? "border-primary bg-primary/10" : "border-border",
            )}
          >
            <span className="flex w-8 shrink-0 justify-center font-heading text-2xl">
              {rankLabel(row, i + 1)}
            </span>
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <div className="flex items-center justify-between gap-2">
                <span className="truncate font-medium">
                  {row.name}
                  {isMe && (
                    <span className="text-muted-foreground"> (you)</span>
                  )}
                </span>
                <Badge
                  className={cn(
                    hasBingo && "bg-highlight text-highlight-foreground",
                  )}
                  variant={hasBingo ? "default" : "outline"}
                >
                  {pluralize(row.lineCount, "line")}
                </Badge>
              </div>
              <Progress
                value={row.tickCount}
                max={row.cellCount}
                aria-label={`${row.name}: ${row.tickCount} of ${row.cellCount} ticked`}
                className="[&_[data-slot=progress-track]]:h-2"
              />
            </div>
          </li>
        );
      })}
    </ol>
  );
}
