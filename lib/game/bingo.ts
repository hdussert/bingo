import type { GridCell } from "./types";

/** Returns the completed lines (rows, columns and diagonals) as lists of cell indices. */
export function findBingoLines(ticked: boolean[], size: number): number[][] {
  const indices = Array.from({ length: size }, (_, i) => i);
  const lines = [
    ...indices.map((row) => indices.map((col) => row * size + col)),
    ...indices.map((col) => indices.map((row) => row * size + col)),
    indices.map((i) => i * size + i),
    indices.map((i) => i * size + (size - 1 - i)),
  ];
  return lines.filter((line) => line.every((cell) => ticked[cell]));
}

/** Returns the completed lines of a saved grid. Grids are always square: size × size cells. */
export function findGridLines(grid: GridCell[]): number[][] {
  return findBingoLines(
    grid.map((cell) => cell.isTicked),
    Math.sqrt(grid.length),
  );
}
