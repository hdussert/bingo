import type { GRID_SIZES } from "./const";

export type GridSize = (typeof GRID_SIZES)[number];

/** An event that might happen during the game. Grid cells refer to it by id. */
export type GameEvent = {
  id: string;
  text: string;
};

export type Game = {
  id: string;
  title: string;
  size: GridSize;
  events: GameEvent[];
};

/** A cell of a player's grid, row by row. */
export type GridCell = {
  eventId: string;
  isTicked: boolean;
};

export type Player = {
  name: string;
  /** Identifies the player within the game: see `toNameKey`. */
  nameKey: string;
  grid: GridCell[];
  /** When the player first completed a line, or `null` without a line. */
  bingoAt: Date | null;
};

/** A game as shown in the list of running games. */
export type RunningGame = {
  id: string;
  title: string;
  size: GridSize;
  playerCount: number;
  lastActivityAt: Date;
  isPrivate: boolean;
};
