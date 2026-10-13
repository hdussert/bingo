import Link from "next/link";
import LinesBadge from "@/components/game/LinesBadge";
import RankNumber from "@/components/game/RankNumber";
import { DrawerClose } from "@/components/ui/drawer";
import { Progress } from "@/components/ui/progress";
import { playHref } from "@/lib/game/links";
import type { LobbyRow } from "@/lib/game/lobby";
import { NAV_BACK, NAV_FORWARD } from "@/lib/transitions";
import { cn } from "@/lib/utils";

type Props = {
  gameId: string;
  /** The current player's name, to keep in the links to the other grids. */
  playerName: string;
  rows: LobbyRow[];
  /** The current player's name key, to highlight their row. */
  playerKey: string;
  /** The name key of the player whose grid is on screen, if not the current player's. */
  peekKey?: string;
};

/** Every player of the game ranked, with their progress, bingos first: tapping one shows their grid. */
export default function Lobby({
  gameId,
  playerName,
  rows,
  playerKey,
  peekKey,
}: Props) {
  return (
    <ol className="flex flex-col gap-2">
      {rows.map((row, i) => {
        const isMe = row.nameKey === playerKey;
        const isViewing = row.nameKey === peekKey;
        const isShown = peekKey ? isViewing : isMe;
        const hasBingo = row.bingoRank !== null;
        const className = cn(
          "flex items-center gap-3 rounded-2xl border-2 px-3 py-2.5 transition-transform active:scale-[0.98]",
          isMe ? "border-primary bg-primary/10" : "border-border",
          isViewing && "border-highlight",
        );
        const content = (
          <>
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
                  {isViewing && (
                    <span className="text-muted-foreground"> (viewing)</span>
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
          </>
        );
        return (
          <li key={row.nameKey}>
            {isShown ? (
              // Already on screen: only closes the drawer
              <DrawerClose
                nativeButton={false}
                render={<div />}
                className={className}
              >
                {content}
              </DrawerClose>
            ) : (
              // The page slides to the other grid, which also closes the drawer (closing it here would cancel the slide)
              <Link
                // Every row would otherwise prefetch a full render of the game page
                prefetch={false}
                // Your own grid comes back from the left, like going back
                transitionTypes={isMe ? NAV_BACK : NAV_FORWARD}
                href={playHref(
                  gameId,
                  playerName,
                  isMe ? undefined : row.nameKey,
                )}
                className={className}
              >
                {content}
              </Link>
            )}
          </li>
        );
      })}
    </ol>
  );
}
