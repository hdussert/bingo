import { randomBytes } from "crypto";

/** A random id for links and rows, from `bytes` random bytes. */
export function newId(bytes: number): string {
  return randomBytes(bytes).toString("base64url");
}
