import {
  and,
  count,
  desc,
  eq,
  exists,
  inArray,
  isNull,
  ne,
  sql,
} from "drizzle-orm";
import { db } from "@/db";
import { games, players, profiles } from "@/db/schema";
import { newId } from "@/lib/id";
import { findGridLines } from "./bingo";
import { buildGrid } from "./grid";
import type { NewGame } from "./schemas";
import { RUNNING_GAME_HOURS } from "./const";
import type { Game, JoinedGame, Player, RunningGame } from "./types";

const playerColumns = {
  profileId: players.profileId,
  name: profiles.name,
  grid: players.grid,
  bingoAt: players.bingoAt,
};

function isPlayer(gameId: string, profileId: string) {
  return and(eq(players.gameId, gameId), eq(players.profileId, profileId));
}

function isOrganizedBy(gameId: string, organizerId: string) {
  return and(eq(games.id, gameId), eq(games.creatorId, organizerId));
}

/** Saves a new game, organized by that profile, with the organizer as its first player; returns its id, used in its link. */
export async function saveGame(
  game: NewGame,
  passwordHash: string | null,
  creatorId: string,
): Promise<string> {
  const id = newId(6);
  const events = game.events.map((text) => ({ id: newId(4), text }));
  // One round trip, and no game without its organizer's grid
  await db.batch([
    db.insert(games).values({
      id,
      title: game.title,
      size: game.size,
      events,
      passwordHash,
      creatorId,
    }),
    db.insert(players).values({
      gameId: id,
      profileId: creatorId,
      grid: buildGrid({ size: game.size, events }),
    }),
  ]);
  return id;
}

/** Finds a game and its join password's hash (`null` for a public game). The hash must stay on the server: see `findPlayableGame`. */
export async function findGameWithPassword(
  id: string,
): Promise<{ game: Game; passwordHash: string | null } | null> {
  const [row] = await db
    .select({
      id: games.id,
      title: games.title,
      size: games.size,
      events: games.events,
      endedAt: games.endedAt,
      creatorId: games.creatorId,
      creatorName: profiles.name,
      passwordHash: games.passwordHash,
    })
    .from(games)
    .leftJoin(profiles, eq(profiles.id, games.creatorId))
    .where(eq(games.id, id))
    .limit(1);
  if (!row) {
    return null;
  }
  const { passwordHash, creatorId, creatorName, endedAt, ...game } = row;
  // The left join: a name means the creator's profile is still there
  const creator =
    creatorId && creatorName !== null
      ? { id: creatorId, name: creatorName }
      : null;
  return {
    game: { ...game, creator, isEnded: endedAt !== null },
    passwordHash,
  };
}

/** Lists the games still running with recent activity, most recently active first. */
export async function listRunningGames(): Promise<RunningGame[]> {
  // greatest() skips the null of a game nobody joined yet
  const lastActivityAt = sql`greatest(${games.createdAt}, max(${players.updatedAt}))`;
  return db
    .select({
      id: games.id,
      title: games.title,
      size: games.size,
      playerCount: count(players.gameId),
      lastActivityAt: lastActivityAt.mapWith(games.createdAt),
      isPrivate: sql<boolean>`${games.passwordHash} is not null`,
    })
    .from(games)
    .leftJoin(players, eq(players.gameId, games.id))
    .where(isNull(games.endedAt))
    .groupBy(games.id)
    .having(
      sql`${lastActivityAt} > now() - make_interval(hours => ${RUNNING_GAME_HOURS})`,
    )
    .orderBy(desc(lastActivityAt));
}

/** Lists the players of a game, in the order they joined. */
export async function listPlayers(gameId: string): Promise<Player[]> {
  return db
    .select(playerColumns)
    .from(players)
    .innerJoin(profiles, eq(profiles.id, players.profileId))
    .where(eq(players.gameId, gameId))
    .orderBy(players.createdAt);
}

/** Lists the games a profile joined, with their players, most recently played first. */
export async function listJoinedGames(
  profileId: string,
): Promise<JoinedGame[]> {
  const myGames = db
    .select({ gameId: players.gameId })
    .from(players)
    .where(eq(players.profileId, profileId));
  const rows = await db
    .select({
      gameId: games.id,
      title: games.title,
      endedAt: games.endedAt,
      creatorId: games.creatorId,
      ...playerColumns,
      updatedAt: players.updatedAt,
    })
    .from(players)
    .innerJoin(games, eq(games.id, players.gameId))
    .innerJoin(profiles, eq(profiles.id, players.profileId))
    .where(inArray(players.gameId, myGames))
    .orderBy(players.createdAt);
  const joined = new Map<string, JoinedGame>();
  // When this profile last ticked in each game
  const playedAt = new Map<string, number>();
  for (const {
    gameId,
    title,
    endedAt,
    creatorId,
    updatedAt,
    ...player
  } of rows) {
    const game = joined.get(gameId) ?? {
      id: gameId,
      title,
      isEnded: endedAt !== null,
      isOrganizer: creatorId === profileId,
      players: [],
    };
    game.players.push(player);
    joined.set(gameId, game);
    if (player.profileId === profileId) {
      playedAt.set(gameId, updatedAt.getTime());
    }
  }
  return [...joined.values()].sort(
    (a, b) => (playedAt.get(b.id) ?? 0) - (playedAt.get(a.id) ?? 0),
  );
}

/** Adds the profile to the game with a new grid, or keeps their grid if they already joined. */
export async function addPlayer(game: Game, profileId: string): Promise<void> {
  await db
    .insert(players)
    .values({ gameId: game.id, profileId, grid: buildGrid(game) })
    .onConflictDoNothing();
}

/** Ticks or unticks one cell of a player's grid, and records when they first reach a bingo. An index outside the grid, a profile that isn't a player of the game, or an ended game changes nothing. */
export async function setCellTicked(
  gameId: string,
  profileId: string,
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
    .where(
      and(
        isPlayer(gameId, profileId),
        exists(
          db
            .select()
            .from(games)
            .where(and(eq(games.id, gameId), isNull(games.endedAt))),
        ),
      ),
    )
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
    // Only if the grid is still the one checked: a newer tick from another device decides instead
    .where(
      and(
        isPlayer(gameId, profileId),
        sql`${players.grid} = ${JSON.stringify(player.grid)}::jsonb`,
      ),
    );
}

/**
 * Saves a game's title and who can join, if that profile organizes it; returns whether it did.
 * `passwordHash` makes it private with that password, `null` public, and leaving it out keeps its current access.
 */
export async function saveGameSettings(
  gameId: string,
  organizerId: string,
  settings: { title: string; passwordHash?: string | null },
): Promise<boolean> {
  const rows = await db
    .update(games)
    // Drizzle leaves out a key set to undefined
    .set(settings)
    .where(isOrganizedBy(gameId, organizerId))
    .returning({ id: games.id });
  return rows.length > 0;
}

/** Ends a game, or reopens it for more ticks, if that profile organizes it; returns whether it did. */
export async function setGameEnded(
  gameId: string,
  organizerId: string,
  isEnded: boolean,
): Promise<boolean> {
  const rows = await db
    .update(games)
    .set({ endedAt: isEnded ? new Date() : null })
    .where(isOrganizedBy(gameId, organizerId))
    .returning({ id: games.id });
  return rows.length > 0;
}

/** Removes a player and their grid from a game, if that profile organizes it (and isn't the player); returns whether it did. */
export async function removePlayer(
  gameId: string,
  organizerId: string,
  profileId: string,
): Promise<boolean> {
  const rows = await db
    .delete(players)
    .where(
      and(
        isPlayer(gameId, profileId),
        ne(players.profileId, organizerId),
        exists(
          db.select().from(games).where(isOrganizedBy(gameId, organizerId)),
        ),
      ),
    )
    .returning({ profileId: players.profileId });
  return rows.length > 0;
}
