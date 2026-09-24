import type { GRID_SIZES } from "./const";

export type GridSize = (typeof GRID_SIZES)[number];

/** A bingo game, as encoded in its shareable link. */
export type Game = {
  title: string;
  size: GridSize;
  events: string[];
};
