import { randomUUID } from "crypto";
import {
  integer,
  jsonb,
  snakeCase,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import type { GameEvent, GridCell } from "@/lib/game/types";

export const games = snakeCase.table("games", {
  id: text().primaryKey(),
  createdAt: timestamp().notNull().defaultNow(),

  title: text().notNull(),
  size: integer().notNull(),
  events: jsonb().$type<GameEvent[]>().notNull(),
});

export const players = snakeCase.table(
  "players",
  {
    id: text()
      .primaryKey()
      .$default(() => randomUUID()),
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp().notNull().defaultNow(),

    gameId: text()
      .notNull()
      .references(() => games.id, { onDelete: "cascade" }),
    name: text().notNull(),
    // Lowercased and trimmed name: rejoining with the same name finds the same player
    nameKey: text().notNull(),
    grid: jsonb().$type<GridCell[]>().notNull(),
  },
  (table) => [uniqueIndex().on(table.gameId, table.nameKey)],
);
