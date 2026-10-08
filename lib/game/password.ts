import { createHash, randomBytes, scryptSync, timingSafeEqual } from "crypto";

// Said out loud and typed on phones: surrounding spaces and case don't count
function normalize(password: string): string {
  return password.trim().toLowerCase();
}

/** Hashes a join password with a random salt, as "salt:hash". */
export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("base64url");
  const hash = scryptSync(normalize(password), salt, 32).toString("base64url");
  return `${salt}:${hash}`;
}

/** Checks a join password against its stored hash. */
export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  const candidate = scryptSync(normalize(password), salt, 32);
  return timingSafeEqual(candidate, Buffer.from(hash, "base64url"));
}

/** The proof of access a phone keeps after entering the password: only the server can derive it from the stored hash. */
export function accessToken(stored: string): string {
  return createHash("sha256").update(`access:${stored}`).digest("base64url");
}
