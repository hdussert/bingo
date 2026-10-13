import {
  integer,
  jsonb,
  primaryKey,
  snakeCase,
  text,
  timestamp,
  uniqueIndex,
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

// A player without an account: this phone's cookie holds the token
export const profiles = snakeCase.table("profiles", {
  id: text().primaryKey(),
  createdAt: timestamp().notNull().defaultNow(),

  // The name the player last used, filled in when they join a new game
  name: text().notNull(),
  // SHA-256 of the token in the profile cookie
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
    name: text().notNull(),
    // Lowercased and trimmed name, so two players of a game can't take the same name
    nameKey: text().notNull(),
    grid: jsonb().$type<GridCell[]>().notNull(),
    // When the player first completed a line; cleared if they untick back to no line
    bingoAt: timestamp(),
  },
  (table) => [
    primaryKey({ columns: [table.gameId, table.profileId] }),
    uniqueIndex().on(table.gameId, table.nameKey),
  ],
);
