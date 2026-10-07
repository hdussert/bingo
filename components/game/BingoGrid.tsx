"use client";

import { useOptimistic, useTransition } from "react";
import { tickCell } from "@/actions/game/tickCell";
import { Toggle } from "@/components/ui/toggle";
import { findBingoLines } from "@/lib/game/bingo";
import type { GridSize } from "@/lib/game/types";
import { cn } from "@/lib/utils";

const COLUMNS: Record<GridSize, string> = {
  3: "grid-cols-3",
  4: "grid-cols-4",
  5: "grid-cols-5",
};

const TEXT_SIZES: Record<GridSize, string> = {
  3: "text-sm sm:text-base",
  4: "text-xs sm:text-sm",
  5: "text-[10px] sm:text-xs",
};

type Props = {
  gameId: string;
  playerName: string;
  size: GridSize;
  cells: { text: string; isTicked: boolean }[];
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
  const [, startTransition] = useTransition();
  const [ticked, setOptimisticTick] = useOptimistic(
    cells.map((cell) => cell.isTicked),
    (state, tick: { index: number; isTicked: boolean }) =>
      state.map((isTicked, i) => (i === tick.index ? tick.isTicked : isTicked)),
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
      setOptimisticTick({ index, isTicked });
      // If saving fails, the cell goes back to its saved state when the transition ends
      await tickCell(gameId, playerName, index, isTicked).catch(() => {});
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className={cn("grid gap-2", COLUMNS[size])}>
        {cells.map((cell, i) => (
          <Toggle
            key={i}
            variant="primary"
            pressed={ticked[i]}
            onPressedChange={() => handleToggle(i)}
            className={cn(
              // Raised like a game button, pressed flat once ticked
              "aspect-square h-auto min-w-0 rounded-[22%] border-2 bg-card p-1 text-center leading-tight font-medium break-words whitespace-normal hyphens-auto shadow-[0_0.25rem_0_var(--color-border)] transition-all",
              TEXT_SIZES[size],
              winningCells.has(i)
                ? "translate-y-1 font-semibold shadow-none aria-pressed:border-highlight aria-pressed:bg-highlight aria-pressed:text-highlight-foreground aria-pressed:hover:bg-highlight aria-pressed:hover:text-highlight-foreground"
                : "aria-pressed:translate-y-1 aria-pressed:shadow-none",
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
