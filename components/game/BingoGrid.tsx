"use client";

import { startTransition, useOptimistic } from "react";
import { tickCell } from "@/actions/game/tickCell";
import { Toggle } from "@/components/ui/toggle";
import { findBingoLines } from "@/lib/game/bingo";
import { GRID_COLUMNS } from "@/lib/game/const";
import type { GridSize } from "@/lib/game/types";
import { cn } from "@/lib/utils";

type Props = {
  gameId: string;
  playerName: string;
  size: GridSize;
  cells: { text: string; isTicked: boolean }[];
};

const TEXT_SIZES: Record<GridSize, string> = {
  3: "text-sm sm:text-base",
  4: "text-xs sm:text-sm",
  5: "text-[10px] sm:text-xs",
};

async function celebrate() {
  const { default: confetti } = await import("canvas-confetti");
  confetti({
    particleCount: 150,
    spread: 90,
    origin: { y: 0.7 },
    disableForReducedMotion: true,
  });
}

/** A player's bingo grid: tap a cell to tick it, and complete a line to get a bingo. */
export default function BingoGrid({ gameId, playerName, size, cells }: Props) {
  const [ticked, setOptimisticTicks] = useOptimistic(
    cells.map((cell) => cell.isTicked),
    (_, next: boolean[]) => next,
  );
  const lines = findBingoLines(ticked, size);
  const winningCells = new Set(lines.flat());

  function handleToggle(index: number) {
    const isTicked = !ticked[index];
    const next = ticked.map((value, i) => (i === index ? isTicked : value));
    if (findBingoLines(next, size).length > lines.length) {
      void celebrate();
    }
    startTransition(async () => {
      setOptimisticTicks(next);
      // If saving fails, the cell goes back to its saved state when the transition ends
      await tickCell(gameId, playerName, index, isTicked).catch(() => {});
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className={cn("grid", GRID_COLUMNS[size])}>
        {cells.map((cell, i) => (
          <Toggle
            key={i}
            variant="primary"
            pressed={ticked[i]}
            onPressedChange={() => handleToggle(i)}
            className={cn(
              // Raised like a game button, pressed flat once ticked (keeping a lighter border). relative: the next row paints over a pressed cell, so it sinks under it
              "relative aspect-square h-auto min-w-0 rounded-[22%] border-2 bg-card p-1 text-center leading-tight font-medium break-words whitespace-normal hyphens-auto shadow-[0_0.25rem_0_var(--color-border)] transition-all",
              TEXT_SIZES[size],
              winningCells.has(i)
                ? "translate-y-1 font-semibold shadow-none aria-pressed:border-[color-mix(in_oklch,var(--color-highlight),white_45%)] aria-pressed:bg-highlight aria-pressed:text-highlight-foreground aria-pressed:hover:bg-highlight aria-pressed:hover:text-highlight-foreground"
                : "aria-pressed:translate-y-1 aria-pressed:border-[color-mix(in_oklch,var(--color-primary),white_35%)] aria-pressed:shadow-none",
            )}
          >
            {cell.text}
          </Toggle>
        ))}
      </div>
      {lines.length > 0 && (
        <p
          role="status"
          className="pb-6 text-center font-heading text-7xl text-cartoon animate-in duration-500 zoom-in-50"
        >
          Bingo!
        </p>
      )}
    </div>
  );
}
