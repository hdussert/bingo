import { cookies } from "next/headers";
import { cache } from "react";
import { normalizeCode } from "./code";
import { createProfile, findProfileByCode } from "./profiles";
import type { Profile } from "./types";

const COOKIE_NAME = "bingo-profile";
// The longest browsers keep a cookie
const COOKIE_MAX_AGE_SECONDS = 400 * 24 * 60 * 60;

async function rememberCode(code: string): Promise<void> {
  (await cookies()).set(COOKIE_NAME, code, {
    httpOnly: true,
    sameSite: "lax",
    // The dev server is plain HTTP on the local network
    secure: process.env.NODE_ENV === "production",
    maxAge: COOKIE_MAX_AGE_SECONDS,
    path: "/",
  });
}

/** The code of the profile this phone keeps, to set up another phone. */
export async function findCurrentCode(): Promise<string | null> {
  return (await cookies()).get(COOKIE_NAME)?.value ?? null;
}

/** The profile this phone keeps, if it has one. Read once per request. */
export const findCurrentProfile = cache(async (): Promise<Profile | null> => {
  const code = await findCurrentCode();
  return code ? findProfileByCode(code) : null;
});

/** The profile this phone keeps, or a new one with that name, remembered on this phone. Only works in server actions. */
export async function findOrStartProfile(name: string): Promise<Profile> {
  const current = await findCurrentProfile();
  if (current) {
    return current;
  }
  const { profile, code } = await createProfile(name);
  await rememberCode(code);
  return profile;
}

/** Switches this phone to the profile of a code typed in, if there's one. Only works in server actions. */
export async function switchProfile(typed: string): Promise<Profile | null> {
  const code = normalizeCode(typed);
  const profile = await findProfileByCode(code);
  if (profile) {
    await rememberCode(code);
  }
  return profile;
}
