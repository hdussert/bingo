"use client";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { GRID_COLUMNS, GRID_SIZES } from "@/lib/game/const";
import type { GridSize } from "@/lib/game/types";
import { cn } from "@/lib/utils";

type Props = {
  size: GridSize;
  onChange: (size: GridSize) => void;
};

/** Picks the grid size with tiles that picture each grid. Submits it as the `size` form field. */
export default function GridSizePicker({ size, onChange }: Props) {
  return (
    <>
      <input type="hidden" name="size" value={size} />
      <ToggleGroup
        variant="primary"
        value={[String(size)]}
        onValueChange={(value) => {
          // Tapping the selected size unselects it: keep the current size instead
          if (value.length === 0) {
            return;
          }
          onChange(Number(value[0]) as GridSize);
        }}
        className="grid w-full grid-cols-3 items-stretch gap-3"
      >
        {GRID_SIZES.map((option) => (
          <ToggleGroupItem
            key={option}
            value={String(option)}
            aria-label={`${option} by ${option} grid`}
            // The text fields' 2px border; the fill stops inside it, so it doesn't brighten it
            className="h-auto flex-col gap-3 rounded-2xl border-2 border-border bg-clip-padding py-4"
          >
            {/* Takes the tile's spare height, so every label sits on the same line */}
            <span
              className={cn(
                "grid flex-1 content-center gap-1",
                GRID_COLUMNS[option],
              )}
            >
              {Array.from({ length: option ** 2 }, (_, i) => (
                <span key={i} className="size-2 rounded-full bg-current" />
              ))}
            </span>
            <span className="font-heading text-lg">
              {option}×{option}
            </span>
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </>
  );
}
