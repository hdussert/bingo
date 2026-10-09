import LinesBadge from "@/components/game/LinesBadge";
import RankNumber from "@/components/game/RankNumber";
import { Progress } from "@/components/ui/progress";
import type { LobbyRow } from "@/lib/game/lobby";
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
            <RankNumber
              position={i + 1}
              bingoRank={row.bingoRank}
              className="w-8 shrink-0 text-center text-2xl"
            />
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <div className="flex items-center justify-between gap-2">
                <span className="truncate font-medium">
                  {row.name}
                  {isMe && (
                    <span className="text-muted-foreground"> (you)</span>
                  )}
                </span>
                <LinesBadge lineCount={row.lineCount} hasBingo={hasBingo} />
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
