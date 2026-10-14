"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { removePlayer as deletePlayer } from "@/lib/game/games";
import { findCurrentProfile } from "@/lib/profile/session";

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
    const profile = await findCurrentProfile();
    if (!profile || !(await deletePlayer(gameId, profile.id, result.data))) {
      return { message: "Only the organizer can remove other players" };
    }
  } catch {
    return { message: "Couldn't remove the player, try again" };
  }
  // The game's pages and the removed player's games
  revalidatePath("/", "layout");
  return {};
}
