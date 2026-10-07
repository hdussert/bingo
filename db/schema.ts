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
});

export const players = snakeCase.table(
  "players",
  {
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp().notNull().defaultNow(),

    gameId: text()
      .notNull()
      .references(() => games.id, { onDelete: "cascade" }),
    name: text().notNull(),
    // Lowercased and trimmed name, so rejoining with the same name finds the same player
    nameKey: text().notNull(),
    grid: jsonb().$type<GridCell[]>().notNull(),
  },
  (table) => [primaryKey({ columns: [table.gameId, table.nameKey] })],
);
