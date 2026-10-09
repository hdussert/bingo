import { cookies } from "next/headers";
import { findGameWithPassword } from "./games";
import { accessToken, verifyPassword } from "./password";
import type { Game } from "./types";

const ACCESS_MAX_AGE_SECONDS = 30 * 24 * 60 * 60;

function cookieName(gameId: string): string {
  return `bingo-access-${gameId}`;
}

async function hasAccess(
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

/** Finds a game, whether it's private, and whether this phone may play it: always for a public game, only after its password for a private one. */
export async function findPlayableGame(
  gameId: string,
): Promise<{ game: Game; isPrivate: boolean; canPlay: boolean } | null> {
  const stored = await findGameWithPassword(gameId);
  if (!stored) {
    return null;
  }
  return {
    game: stored.game,
    isPrivate: stored.passwordHash !== null,
    canPlay: await hasAccess(gameId, stored.passwordHash),
  };
}

/** Checks a private game's password and, if it's right, remembers it on this phone. Only works in server actions. */
export async function unlockGame(
  gameId: string,
  password: string,
): Promise<boolean> {
  const stored = await findGameWithPassword(gameId);
  if (
    !stored?.passwordHash ||
    !(await verifyPassword(password, stored.passwordHash))
  ) {
    return false;
  }
  await grantAccess(gameId, stored.passwordHash);
  return true;
}
