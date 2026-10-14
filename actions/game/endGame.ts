"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { findOrganizedGame } from "@/lib/game/access";
import { setGameEnded } from "@/lib/game/games";

export type EndGameState = {
  message?: string;
};

/** Ends a game (no more joining or ticking), or reopens it, for its organizer. */
export async function endGame(
  gameId: string,
  _state: EndGameState,
  formData: FormData,
): Promise<EndGameState> {
  const result = z.stringbool().safeParse(formData.get("isEnded"));
  if (!result.success) {
    return { message: "Couldn't tell whether to end the game" };
  }

  try {
    if (!(await findOrganizedGame(gameId))) {
      return { message: "Only the organizer can end the game" };
    }
    await setGameEnded(gameId, result.data);
  } catch {
    return { message: "Couldn't update the game, try again" };
  }
  // The game's pages and the lists of games
  revalidatePath("/", "layout");
  return {};
}
