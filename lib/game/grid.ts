import type { Game } from "./types";

/** FNV-1a 32-bit hash. */
function hash(text: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** Mulberry32: a small seeded PRNG returning floats in [0, 1). */
function seededRandom(seed: number): () => number {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Identifies a player's grid: the same game code and name (ignoring case and spaces) give the same id. */
export function gridId(code: string, name: string): string {
  return hash(`${code}\n${name.trim().toLowerCase()}`).toString(36);
}

/** Picks and shuffles the player's cells, row by row. Deterministic for a given game code and name. */
export function buildGrid(game: Game, code: string, name: string): string[] {
  const random = seededRandom(parseInt(gridId(code, name), 36));
  const events = [...game.events];
  for (let i = events.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [events[i], events[j]] = [events[j], events[i]];
  }
  return events.slice(0, game.size ** 2);
}
