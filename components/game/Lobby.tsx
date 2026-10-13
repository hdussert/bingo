import Link from "next/link";
import LinesBadge from "@/components/game/LinesBadge";
import RankNumber from "@/components/game/RankNumber";
import { DrawerClose } from "@/components/ui/drawer";
import { Progress } from "@/components/ui/progress";
import { peekHref } from "@/lib/game/links";
import type { LobbyRow } from "@/lib/game/lobby";
import { NAV_FORWARD } from "@/lib/transitions";
import { cn } from "@/lib/utils";

type Props = {
  gameId: string;
  /** The current player's profile id, to highlight their row. */
  playerId: string;
  rows: LobbyRow[];
};

/** Every player of the game ranked, with their progress, bingos first: tapping one shows their grid. */
export default function Lobby({ gameId, playerId, rows }: Props) {
  return (
    <ol className="flex flex-col gap-2">
      {rows.map((row, i) => {
        const isMe = row.profileId === playerId;
        const hasBingo = row.bingoRank !== null;
        const className = cn(
          "flex items-center gap-3 rounded-2xl border-2 px-3 py-2.5 transition-transform active:scale-[0.98]",
          isMe ? "border-primary bg-primary/10" : "border-border",
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
          <li key={row.profileId}>
            {isMe ? (
              // Your grid is already on screen: only closes the drawer
              <DrawerClose
                nativeButton={false}
                render={<div />}
                className={className}
              >
                {content}
              </DrawerClose>
            ) : (
              // Leaving the page closes the drawer (closing it here would cancel the slide)
              <Link
                // Every row would otherwise prefetch a full render of its page
                prefetch={false}
                transitionTypes={NAV_FORWARD}
                href={peekHref(gameId, row.profileId)}
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
