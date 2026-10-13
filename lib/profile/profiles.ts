import { createHash, randomBytes } from "crypto";
import { and, eq, inArray, ne } from "drizzle-orm";
import { db } from "@/db";
import { games, players, profiles } from "@/db/schema";
import { toNameKey } from "@/lib/game/grid";
import type { Profile } from "./types";

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

/** Creates a profile and returns it with its token, the secret its phone keeps. */
export async function createProfile(
  name: string,
): Promise<{ profile: Profile; token: string }> {
  const token = randomBytes(32).toString("base64url");
  const profile = { id: randomBytes(9).toString("base64url"), name };
  await db.insert(profiles).values({ ...profile, tokenHash: hashToken(token) });
  return { profile, token };
}

/** Finds the profile a token belongs to. */
export async function findProfileByToken(
  token: string,
): Promise<Profile | null> {
  const [profile] = await db
    .select({ id: profiles.id, name: profiles.name })
    .from(profiles)
    .where(eq(profiles.tokenHash, hashToken(token)))
    .limit(1);
  return profile ?? null;
}

/** Sets the name filled in when the player joins a new game. */
export async function setDefaultName(
  profileId: string,
  name: string,
): Promise<void> {
  await db.update(profiles).set({ name }).where(eq(profiles.id, profileId));
}

/** Renames the player in every game they joined. Returns the titles of the games where another player already has that name, and then renames nothing. */
export async function renameInGames(
  profileId: string,
  name: string,
): Promise<string[]> {
  const nameKey = toNameKey(name);
  const myGameIds = db
    .select({ gameId: players.gameId })
    .from(players)
    .where(eq(players.profileId, profileId));
  const taken = await db
    .select({ title: games.title })
    .from(players)
    .innerJoin(games, eq(games.id, players.gameId))
    .where(
      and(
        inArray(players.gameId, myGameIds),
        eq(players.nameKey, nameKey),
        ne(players.profileId, profileId),
      ),
    );
  if (taken.length > 0) {
    return taken.map((game) => game.title);
  }
  await db.batch([
    db.update(profiles).set({ name }).where(eq(profiles.id, profileId)),
    db
      .update(players)
      .set({ name, nameKey })
      .where(eq(players.profileId, profileId)),
  ]);
  return [];
}
