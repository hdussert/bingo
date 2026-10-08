import { createHash, randomBytes, scrypt, timingSafeEqual } from "crypto";
import { promisify } from "util";

// Async, so hashing doesn't block the other requests served by the same instance
const scryptAsync = promisify(scrypt) as (
  password: string,
  salt: string,
  keyLength: number,
) => Promise<Buffer>;

// Said out loud and typed on phones: surrounding spaces and case don't count
function normalize(password: string): string {
  return password.trim().toLowerCase();
}

/** Hashes a join password with a random salt, as "salt:hash". */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("base64url");
  const hash = await scryptAsync(normalize(password), salt, 32);
  return `${salt}:${hash.toString("base64url")}`;
}

/** Checks a join password against its stored hash. */
export async function verifyPassword(
  password: string,
  stored: string,
): Promise<boolean> {
  const [salt, hash] = stored.split(":");
  const candidate = await scryptAsync(normalize(password), salt, 32);
  return timingSafeEqual(candidate, Buffer.from(hash, "base64url"));
}

/** The proof of access a phone keeps after entering the password: only the server can derive it from the stored hash. */
export function accessToken(stored: string): string {
  return createHash("sha256").update(`access:${stored}`).digest("base64url");
}
