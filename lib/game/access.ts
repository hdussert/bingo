import { cookies } from "next/headers";
import { accessToken } from "./password";

const ACCESS_MAX_AGE_SECONDS = 30 * 24 * 60 * 60;

function cookieName(gameId: string): string {
  return `bingo-access-${gameId}`;
}

/** Remembers on this phone that the game's password was entered. Only works in server actions. */
export async function grantAccess(
  gameId: string,
  passwordHash: string,
): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(cookieName(gameId), accessToken(passwordHash), {
    httpOnly: true,
    sameSite: "lax",
    // The dev server is plain HTTP on the local network
    secure: process.env.NODE_ENV === "production",
    maxAge: ACCESS_MAX_AGE_SECONDS,
    path: "/",
  });
}

/** Whether this phone may see and play the game: always for a public game, with the access cookie for a private one. */
export async function hasAccess(
  gameId: string,
  passwordHash: string | null,
): Promise<boolean> {
  if (!passwordHash) {
    return true;
  }
  const cookieStore = await cookies();
  return (
    cookieStore.get(cookieName(gameId))?.value === accessToken(passwordHash)
  );
}
