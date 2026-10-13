"use server";

import { revalidatePath } from "next/cache";
import { findPlayableGame, unlockGame } from "@/lib/game/access";
import { addPlayer } from "@/lib/game/games";
import { playerNameSchema } from "@/lib/game/schemas";
import { findOrStartProfile } from "@/lib/profile/session";
import { renameProfile } from "@/lib/profile/profiles";

export type JoinGameState = {
  message?: string;
  /** The field the message is about, to highlight it. */
  invalidField?: "name" | "password";
  values?: { name: string };
};

/** Adds the player to the game under that name, starting their profile on this phone if needed. */
export async function joinGame(
  gameId: string,
  _state: JoinGameState,
  formData: FormData,
): Promise<JoinGameState> {
  const name = String(formData.get("name") ?? "");
  const result = playerNameSchema.safeParse(name);
  if (!result.success) {
    return {
      message: result.error.issues[0].message,
      invalidField: "name",
      values: { name },
    };
  }

  try {
    const playable = await findPlayableGame(gameId);
    if (!playable) {
      return { message: "This game doesn't exist anymore", values: { name } };
    }
    if (!playable.isUnlocked) {
      const password = String(formData.get("password") ?? "");
      if (!(await unlockGame(gameId, password))) {
        return {
          message: "Wrong password",
          invalidField: "password",
          values: { name },
        };
      }
    }
    const profile = await findOrStartProfile(result.data);
    // One name in every game: joining under another one renames the player
    if (profile.name !== result.data) {
      await renameProfile(profile.id, result.data);
    }
    await addPlayer(playable.game, profile.id);
  } catch {
    return { message: "Couldn't join the game, try again", values: { name } };
  }
  // Shows the grid in place of the join form, and the name if it changed
  revalidatePath("/", "layout");
  return {};
}
