"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { findOrganizedGame } from "@/lib/game/access";
import { removePlayer as deletePlayer } from "@/lib/game/games";

export type RemovePlayerState = {
  message?: string;
};

/** Removes a player and their grid from a game, for its organizer. */
export async function removePlayer(
  gameId: string,
  _state: RemovePlayerState,
  formData: FormData,
): Promise<RemovePlayerState> {
  const result = z.string().min(1).safeParse(formData.get("profileId"));
  if (!result.success) {
    return { message: "Couldn't tell which player to remove" };
  }

  try {
    if (!(await findOrganizedGame(gameId))) {
      return { message: "Only the organizer can remove players" };
    }
    await deletePlayer(gameId, result.data);
  } catch {
    return { message: "Couldn't remove the player, try again" };
  }
  // The game's pages and the removed player's games
  revalidatePath("/", "layout");
  return {};
}
