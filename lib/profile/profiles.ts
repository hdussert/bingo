import { createHash } from "crypto";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { profiles } from "@/db/schema";
import { newId } from "@/lib/id";
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
  const profile = { id: newId(9), name };
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

/** Changes the player's name, in every game they joined. */
export async function renameProfile(
  profileId: string,
  name: string,
): Promise<void> {
  await db.update(profiles).set({ name }).where(eq(profiles.id, profileId));
}
