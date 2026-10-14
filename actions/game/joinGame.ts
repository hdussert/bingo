"use server";

import { revalidatePath } from "next/cache";
import { findPlayableGame, unlockGame } from "@/lib/game/access";
import { addPlayer } from "@/lib/game/games";
import { playerNameSchema } from "@/lib/game/schemas";
import { findOrStartProfile } from "@/lib/profile/session";

export type JoinGameState = {
  message?: string;
  /** The field the message is about, to highlight it. */
  invalidField?: "name" | "password";
  values?: { name: string };
};

/** Adds this phone's profile to the game, or starts one from the name typed in on a phone without one. */
export async function joinGame(
  gameId: string,
  _state: JoinGameState,
  formData: FormData,
): Promise<JoinGameState> {
  const name = String(formData.get("name") ?? "");
  // Only asked when this phone has no profile yet
  const result = formData.has("name") ? playerNameSchema.safeParse(name) : null;
  if (result?.success === false) {
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
    if (playable.game.isEnded) {
      return { message: "This game has ended", values: { name } };
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
    const profile = result
      ? await findOrStartProfile(result.data)
      : playable.profile;
    if (!profile) {
      return {
        message: "Enter your name",
        invalidField: "name",
        values: { name },
      };
    }
    await addPlayer(playable.game, profile.id);
  } catch {
    return { message: "Couldn't join the game, try again", values: { name } };
  }
  // Shows the grid in place of the join form, and the new profile's icon
  revalidatePath("/", "layout");
  return {};
}
