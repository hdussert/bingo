"use client";

import confetti from "canvas-confetti";
import { startTransition, useEffect, useOptimistic, useState } from "react";
import { tickCell } from "@/actions/game/tickCell";
import BingoBanner from "@/components/game/BingoBanner";
import { Toggle } from "@/components/ui/toggle";
import { findBingoLines } from "@/lib/game/bingo";
import { GRID_COLUMNS } from "@/lib/game/const";
import type { GridSize } from "@/lib/game/types";
import { cn } from "@/lib/utils";

type Props = {
  gameId: string;
  size: GridSize;
  cells: { text: string; isTicked: boolean }[];
  /** A grid to look at but not tick: another player's, or one of an ended game. */
  isReadOnly?: boolean;
};

const TEXT_SIZES: Record<GridSize, string> = {
  3: "text-base sm:text-lg",
  4: "text-sm sm:text-base",
  5: "text-xs sm:text-sm",
};

// Long enough for the letters to bounce in and be read
const BANNER_MS = 2000;

// Created on the first bingo. Draws on the main thread: the library's default draws in a worker,
// which in Safari can stop drawing for the rest of the page's life
let fireConfetti: confetti.CreateTypes | null = null;

function celebrate() {
  fireConfetti ??= confetti.create(undefined, {
    resize: true,
    useWorker: false,
    disableForReducedMotion: true,
  });
  void fireConfetti({
    particleCount: 150,
    spread: 90,
    origin: { y: 0.7 },
    // Above the grid but under the Bingo! banner (and the leaderboard drawer)
    zIndex: 10,
  });
}

/** A player's bingo grid: tap a cell to tick it, and complete a line to get a bingo. */
export default function BingoGrid({
  gameId,
  size,
  cells,
  isReadOnly = false,
}: Props) {
  const [ticked, setOptimisticTicks] = useOptimistic(
    cells.map((cell) => cell.isTicked),
    (_, next: boolean[]) => next,
  );
  const lines = findBingoLines(ticked, size);
  const winningCells = new Set(lines.flat());
  // The last cell tapped, so only it bounces: cells already ticked on page load stay still
  const [tappedIndex, setTappedIndex] = useState<number | null>(null);
  // Set when a tick completes a line, to show the banner for a moment
  const [celebrationId, setCelebrationId] = useState<number | null>(null);

  useEffect(() => {
    if (celebrationId === null) {
      return;
    }
    const timeout = setTimeout(() => setCelebrationId(null), BANNER_MS);
    return () => clearTimeout(timeout);
  }, [celebrationId]);

  function handleToggle(index: number) {
    const isTicked = !ticked[index];
    setTappedIndex(index);
    const next = ticked.map((value, i) => (i === index ? isTicked : value));
    if (findBingoLines(next, size).length > lines.length) {
      celebrate();
      setCelebrationId((id) => (id ?? 0) + 1);
    }
    startTransition(async () => {
      setOptimisticTicks(next);
      // If saving fails, the cell goes back to its saved state when the transition ends
      await tickCell(gameId, index, isTicked).catch(() => {});
    });
  }

  return (
    <>
      <div className={cn("grid gap-1.5", GRID_COLUMNS[size])}>
        {cells.map((cell, i) => (
          <Toggle
            key={i}
            variant="primary"
            pressed={ticked[i]}
            disabled={isReadOnly}
            onPressedChange={() => handleToggle(i)}
            className={cn(
              // Raised like a game button, pressed flat once ticked; the gap leaves room for the raised edge
              "aspect-square h-auto min-w-0 rounded-[22%] border-0 bg-card p-1 text-center leading-tight font-medium break-words whitespace-normal hyphens-auto shadow-[0_0.25rem_0_var(--color-border)] transition-all",
              // Squashes and bounces back when ticked (the scale property, so it adds to the pressed translate)
              i === tappedIndex &&
                "aria-pressed:animate-[tick-pop_300ms_ease-out] motion-reduce:animate-none",
              TEXT_SIZES[size],
              winningCells.has(i)
                ? "translate-y-1 font-semibold shadow-none aria-pressed:bg-highlight aria-pressed:text-highlight-foreground aria-pressed:hover:bg-highlight aria-pressed:hover:text-highlight-foreground"
                : "aria-pressed:translate-y-1 aria-pressed:shadow-none",
              // Flat and at full color: nothing to press, but nothing grayed out either
              isReadOnly &&
                "translate-y-0 shadow-none disabled:opacity-100 aria-pressed:translate-y-0",
            )}
          >
            {cell.text}
          </Toggle>
        ))}
      </div>
      {celebrationId !== null && (
        // Keyed, so a new line while it's showing replays it
        <BingoBanner key={celebrationId} />
      )}
    </>
  );
}
