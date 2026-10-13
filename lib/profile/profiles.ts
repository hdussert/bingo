import { createHash, randomBytes } from "crypto";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { players, profiles } from "@/db/schema";
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

/** Renames the player in every game they joined. */
export async function renameInGames(
  profileId: string,
  name: string,
): Promise<void> {
  await db.batch([
    db.update(profiles).set({ name }).where(eq(profiles.id, profileId)),
    db.update(players).set({ name }).where(eq(players.profileId, profileId)),
  ]);
}
