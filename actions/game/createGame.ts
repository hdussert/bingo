"use server";

import { saveGame } from "@/lib/game/games";
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
  });
  if (!result.success) {
    return {
      errors: [...new Set(result.error.issues.map((issue) => issue.message))],
    };
  }

  try {
    const gameId = await saveGame(result.data);
    return { gameId };
  } catch {
    return { errors: ["Couldn't save the game, try again"] };
  }
}
