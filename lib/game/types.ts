import type { Profile } from "@/lib/profile/types";
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
  /** The organizer, who can manage the game, or `null` for a game created before profiles. */
  creator: Profile | null;
  /** When the organizer ended the game, or `null` while it runs. */
  endedAt: Date | null;
};

/** A cell of a player's grid, row by row. */
export type GridCell = {
  eventId: string;
  isTicked: boolean;
};

export type Player = {
  profileId: string;
  name: string;
  grid: GridCell[];
  /** When the player first completed a line, or `null` without a line. */
  bingoAt: Date | null;
};

/** A game the current player joined, with all its players. */
export type JoinedGame = {
  id: string;
  title: string;
  isEnded: boolean;
  /** Whether the current player organizes it. */
  isOrganizer: boolean;
  players: Player[];
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
