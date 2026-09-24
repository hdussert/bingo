"use client";

import { findBingoLines } from "@/lib/game/bingo";
import type { GridSize } from "@/lib/game/types";
import { useTicks } from "./useTicks";

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
  cells: string[];
  size: GridSize;
  storageKey: string;
};

/** A player's bingo grid: tap a cell to tick it, and complete a line to get a bingo. */
export default function BingoGrid({ cells, size, storageKey }: Props) {
  const { ticked, toggle } = useTicks(storageKey, cells.length);
  const lines = findBingoLines(ticked, size);
  const winningCells = new Set(lines.flat());

  return (
    <div className="flex flex-col gap-4">
      <div className={`grid gap-1.5 ${COLUMNS[size]}`}>
        {cells.map((cell, i) => (
          <button
            key={i}
            type="button"
            aria-pressed={ticked[i]}
            onClick={() => toggle(i)}
            className={`flex aspect-square items-center justify-center overflow-hidden rounded-lg border p-1 text-center leading-tight break-words hyphens-auto transition-colors ${TEXT_SIZES[size]} ${
              winningCells.has(i)
                ? "border-amber-400 bg-amber-400 font-semibold text-black"
                : ticked[i]
                  ? "border-violet-600 bg-violet-600 text-white"
                  : "border-zinc-300 bg-white text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
            }`}
          >
            {cell}
          </button>
        ))}
      </div>
      {lines.length > 0 && (
        <p
          role="status"
          className="text-center text-4xl font-black tracking-tight text-amber-500"
        >
          BINGO!
        </p>
      )}
    </div>
  );
}
