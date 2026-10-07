import { z } from "zod";
import {
  GRID_SIZES,
  MAX_EVENT_LENGTH,
  MAX_EVENTS,
  MAX_NAME_LENGTH,
  MAX_TITLE_LENGTH,
} from "./const";

/** Validates a new game, with messages meant for the organizer. */
export const newGameSchema = z
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

export type NewGame = z.infer<typeof newGameSchema>;

export const playerNameSchema = z
  .string()
  .trim()
  .min(1, "Enter your name")
  .max(MAX_NAME_LENGTH, `Names are limited to ${MAX_NAME_LENGTH} characters`);

/** Returns the non-empty lines of `text`, trimmed and without duplicates (ignoring case). */
export function parseEvents(text: string): string[] {
  const seen = new Set<string>();
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => {
      const key = line.toLowerCase();
      if (!line || seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
}
