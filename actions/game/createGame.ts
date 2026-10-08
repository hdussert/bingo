"use server";

import { grantAccess } from "@/lib/game/access";
import { saveGame } from "@/lib/game/games";
import { hashPassword } from "@/lib/game/password";
import { newGameSchema, parseEvents } from "@/lib/game/schemas";

export type CreateGameState = {
  gameId?: string;
  errors?: string[];
};

/** Validates and saves a new game; returns its id, or the validation errors. */
export async function createGame(
  _state: CreateGameState,
  formData: FormData,
): Promise<CreateGameState> {
  const result = newGameSchema.safeParse({
    title: formData.get("title"),
    size: Number(formData.get("size")),
    events: parseEvents(String(formData.get("events") ?? "")),
    isPrivate: formData.get("isPrivate") === "on",
    password: String(formData.get("password") ?? ""),
  });
  if (!result.success) {
    return {
      errors: [...new Set(result.error.issues.map((issue) => issue.message))],
    };
  }

  const game = result.data;
  const passwordHash = game.isPrivate ? hashPassword(game.password) : null;
  try {
    const gameId = await saveGame(game, passwordHash);
    // The organizer's phone can open the game without typing the password
    if (passwordHash) {
      await grantAccess(gameId, passwordHash);
    }
    return { gameId };
  } catch {
    return { errors: ["Couldn't save the game, try again"] };
  }
}
