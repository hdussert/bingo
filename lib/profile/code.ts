import { randomInt } from "crypto";

// No 0/O, 1/I/L or U/V lookalikes: read on one phone, typed on another
const ALPHABET = "23456789ABCDEFGHJKMNPQRSTWXYZ";
const CODE_LENGTH = 12;

/** A new profile code: about 58 bits of randomness, far too many to guess. */
export function newCode(): string {
  return Array.from(
    { length: CODE_LENGTH },
    () => ALPHABET[randomInt(ALPHABET.length)],
  ).join("");
}

/** The code as typed, without case, spaces or dashes. */
export function normalizeCode(typed: string): string {
  return typed.toUpperCase().replace(/[^0-9A-Z]/g, "");
}

/** The code in groups of four, easier to read out: `K7QP-9XMA-3TRB`. */
export function formatCode(code: string): string {
  return code.match(/.{1,4}/g)?.join("-") ?? code;
}
