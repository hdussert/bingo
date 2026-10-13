import { cookies } from "next/headers";
import { cache } from "react";
import { createProfile, findProfileByToken } from "./profiles";
import type { Profile } from "./types";

const COOKIE_NAME = "bingo-profile";
// The longest browsers keep a cookie
const COOKIE_MAX_AGE_SECONDS = 400 * 24 * 60 * 60;

/** The profile this phone keeps, if it has one. Read once per request. */
export const findCurrentProfile = cache(async (): Promise<Profile | null> => {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  return token ? findProfileByToken(token) : null;
});

/** The profile this phone keeps, or a new one with that name, remembered on this phone. Only works in server actions. */
export async function findOrStartProfile(name: string): Promise<Profile> {
  const current = await findCurrentProfile();
  if (current) {
    return current;
  }
  const { profile, token } = await createProfile(name);
  (await cookies()).set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    // The dev server is plain HTTP on the local network
    secure: process.env.NODE_ENV === "production",
    maxAge: COOKIE_MAX_AGE_SECONDS,
    path: "/",
  });
  return profile;
}
