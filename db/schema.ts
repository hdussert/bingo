import {
  integer,
  jsonb,
  primaryKey,
  snakeCase,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import type { GameEvent, GridCell, GridSize } from "@/lib/game/types";

export const games = snakeCase.table("games", {
  id: text().primaryKey(),
  createdAt: timestamp().notNull().defaultNow(),

  title: text().notNull(),
  size: integer().$type<GridSize>().notNull(),
  events: jsonb().$type<GameEvent[]>().notNull(),
  // Salted scrypt hash of the join password ("salt:hash"), or null for a public game
  passwordHash: text(),
});

// A player without an account: their phones' cookie holds the profile's code
export const profiles = snakeCase.table("profiles", {
  id: text().primaryKey(),
  createdAt: timestamp().notNull().defaultNow(),

  // The name the player last used, filled in when they join a new game
  name: text().notNull(),
  // SHA-256 of the profile's code
  tokenHash: text().notNull().unique(),
});

export const players = snakeCase.table(
  "players",
  {
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp().notNull().defaultNow(),

    gameId: text()
      .notNull()
      .references(() => games.id, { onDelete: "cascade" }),
    profileId: text()
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    // Only shown: players are told apart by profile, so two can share a name
    name: text().notNull(),
    grid: jsonb().$type<GridCell[]>().notNull(),
    // When the player first completed a line; cleared if they untick back to no line
    bingoAt: timestamp(),
  },
  (table) => [primaryKey({ columns: [table.gameId, table.profileId] })],
);
