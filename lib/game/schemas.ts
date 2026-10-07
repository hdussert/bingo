import { z } from "zod";
import {
  GRID_SIZES,
  MAX_EVENT_LENGTH,
  MAX_EVENTS,
  MAX_TITLE_LENGTH,
} from "./const";
import type { Game } from "./types";

/** Validates a game, with messages meant for the organizer. */
export const gameSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, "Give the game a title")
      .max(
        MAX_TITLE_LENGTH,
        `The title is limited to ${MAX_TITLE_LENGTH} characters`,
      ),
    size: z.literal(GRID_SIZES),
    events: z
      .array(
        z
          .string()
          .trim()
          .min(1)
          .max(
            MAX_EVENT_LENGTH,
            `Events are limited to ${MAX_EVENT_LENGTH} characters`,
          ),
      )
      .max(MAX_EVENTS, `A game is limited to ${MAX_EVENTS} events`),
  })
  .refine((game) => game.events.length >= game.size ** 2, {
    message: "Not enough events for this grid",
    path: ["events"],
  });

/** Encodes a game as a URL-safe string (base64url of its JSON). */
export function encodeGame(game: Game): string {
  const bytes = new TextEncoder().encode(JSON.stringify(game));
  const binary = String.fromCharCode(...bytes);
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

/** Decodes a game from its link code, or returns `null` if the code is invalid. */
export function decodeGame(code: string): Game | null {
  try {
    const binary = atob(code.replace(/-/g, "+").replace(/_/g, "/"));
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    const result = gameSchema.safeParse(
      JSON.parse(new TextDecoder().decode(bytes)),
    );
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}
