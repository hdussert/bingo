import { randomBytes } from "crypto";
import { and, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { games, players } from "@/db/schema";
import { buildGrid, toNameKey } from "./grid";
import type { NewGame } from "./schemas";
import type { Game, GridSize, Player } from "./types";

function newId(bytes: number): string {
  return randomBytes(bytes).toString("base64url");
}

/** Saves a new game and returns its id, used in its link. */
export async function saveGame(game: NewGame): Promise<string> {
  const id = newId(6);
  await db.insert(games).values({
    id,
    title: game.title,
    size: game.size,
    events: game.events.map((text) => ({ id: newId(4), text })),
  });
  return id;
}

export async function findGame(id: string): Promise<Game | null> {
  const [row] = await db
    .select({
      id: games.id,
      title: games.title,
      size: games.size,
      events: games.events,
    })
    .from(games)
    .where(eq(games.id, id))
    .limit(1);
  if (!row) {
    return null;
  }
  return { ...row, size: row.size as GridSize };
}

export async function findPlayer(
  gameId: string,
  name: string,
): Promise<Player | null> {
  const [row] = await db
    .select({ name: players.name, grid: players.grid })
    .from(players)
    .where(
      and(eq(players.gameId, gameId), eq(players.nameKey, toNameKey(name))),
    )
    .limit(1);
  return row ?? null;
}

/** Adds a player with a new grid, or keeps the existing player of that name. */
export async function addPlayer(game: Game, name: string): Promise<void> {
  await db
    .insert(players)
    .values({
      gameId: game.id,
      name: name.trim(),
      nameKey: toNameKey(name),
      grid: buildGrid(game),
    })
    .onConflictDoNothing({ target: [players.gameId, players.nameKey] });
}

/** Ticks or unticks one cell of a player's grid. An index outside the grid changes nothing. */
export async function setCellTicked(
  gameId: string,
  name: string,
  index: number,
  isTicked: boolean,
): Promise<void> {
  await db
    .update(players)
    .set({
      // Updates the cell in the database, so two quick taps can't overwrite each other
      grid: sql`jsonb_set(${players.grid}, array[${String(index)}, 'isTicked'], to_jsonb(${isTicked}::boolean), false)`,
      updatedAt: new Date(),
    })
    .where(
      and(eq(players.gameId, gameId), eq(players.nameKey, toNameKey(name))),
    );
}
