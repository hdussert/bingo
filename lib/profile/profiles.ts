import { createHash, randomBytes } from "crypto";
import { and, eq, inArray, ne } from "drizzle-orm";
import { db } from "@/db";
import { games, players, profiles } from "@/db/schema";
import { toNameKey } from "@/lib/game/grid";
import { newCode } from "./code";
import type { Profile } from "./types";

function hashCode(code: string): string {
  return createHash("sha256").update(code).digest("hex");
}

/** Creates a profile and returns it with its code, the secret its phones keep. */
export async function createProfile(
  name: string,
): Promise<{ profile: Profile; code: string }> {
  const code = newCode();
  const profile = { id: randomBytes(9).toString("base64url"), name };
  await db.insert(profiles).values({ ...profile, tokenHash: hashCode(code) });
  return { profile, code };
}

/** Finds the profile a code belongs to. */
export async function findProfileByCode(code: string): Promise<Profile | null> {
  const [profile] = await db
    .select({ id: profiles.id, name: profiles.name })
    .from(profiles)
    .where(eq(profiles.tokenHash, hashCode(code)))
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
