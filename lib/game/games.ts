import { randomBytes } from "crypto";
import { and, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { games, players } from "@/db/schema";
import { findGridLines } from "./bingo";
import { buildGrid, toNameKey } from "./grid";
import type { NewGame } from "./schemas";
import type { Game, Player } from "./types";

function newId(bytes: number): string {
  return randomBytes(bytes).toString("base64url");
}

function isPlayer(gameId: string, name: string) {
  return and(eq(players.gameId, gameId), eq(players.nameKey, toNameKey(name)));
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
  return row ?? null;
}

/** Lists the players of a game, in the order they joined. */
export async function listPlayers(gameId: string): Promise<Player[]> {
  return db
    .select({
      name: players.name,
      nameKey: players.nameKey,
      grid: players.grid,
      bingoAt: players.bingoAt,
    })
    .from(players)
    .where(eq(players.gameId, gameId))
    .orderBy(players.createdAt);
}

/** Adds a player with a new grid, or keeps the existing player of that name. */
export async function addPlayer(game: Game, name: string): Promise<void> {
  await db
    .insert(players)
    .values({
      gameId: game.id,
      name,
      nameKey: toNameKey(name),
      grid: buildGrid(game),
    })
    .onConflictDoNothing({ target: [players.gameId, players.nameKey] });
}

/** Ticks or unticks one cell of a player's grid, and records when they first reach a bingo. An index outside the grid changes nothing. */
export async function setCellTicked(
  gameId: string,
  name: string,
  index: number,
  isTicked: boolean,
): Promise<void> {
  const [player] = await db
    .update(players)
    .set({
      // Updates the cell in the database, so two quick taps can't overwrite each other
      grid: sql`jsonb_set(${players.grid}, array[${String(index)}, 'isTicked'], to_jsonb(${isTicked}::boolean), false)`,
      updatedAt: new Date(),
    })
    .where(isPlayer(gameId, name))
    .returning({ grid: players.grid, bingoAt: players.bingoAt });
  if (!player) {
    return;
  }

  const hasBingo = findGridLines(player.grid).length > 0;
  if (hasBingo === (player.bingoAt !== null)) {
    return;
  }
  await db
    .update(players)
    .set({ bingoAt: hasBingo ? new Date() : null })
    .where(isPlayer(gameId, name));
}
