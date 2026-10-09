import { TrophyIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { LobbyRow } from "@/lib/game/lobby";
import { pluralize } from "@/lib/game/format";
import { cn } from "@/lib/utils";

const MEDALS = ["🥇", "🥈", "🥉"];

type Props = {
  rows: LobbyRow[];
  /** The current player's name key, to highlight their row. */
  playerKey: string;
};

// Medals for the first three bingos, the position for everyone else
function rankLabel(row: LobbyRow, position: number): string | number {
  const medal = row.bingoRank === null ? undefined : MEDALS[row.bingoRank - 1];
  return medal ?? position;
}

/** Every player of the game, with their progress, bingos first. */
export default function Lobby({ rows, playerKey }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <TrophyIcon strokeWidth={3} className="size-5" />
          Leaderboard
        </CardTitle>
        <CardAction className="row-span-1 flex items-center gap-2 self-center text-sm text-muted-foreground">
          {/* The page refreshes on its own: the dot says it's live */}
          <span className="size-2 animate-pulse rounded-full bg-highlight motion-reduce:animate-none" />
          {pluralize(rows.length, "player")}
        </CardAction>
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  );
}
