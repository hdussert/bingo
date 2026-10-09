"use server";

import { redirect } from "next/navigation";
import { findPlayableGame, unlockGame } from "@/lib/game/access";
import { addPlayer } from "@/lib/game/games";
import { playerNameSchema } from "@/lib/game/schemas";
import { playHref } from "@/lib/game/links";

export type JoinGameState = {
  message?: string;
  /** The field the message is about, to highlight it. */
  invalidField?: "name" | "password";
  values?: { name: string };
};

/** Adds the player to the game (or finds them if they already joined), then opens their grid. */
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
    if (!playable.canPlay) {
      const password = String(formData.get("password") ?? "");
      if (!(await unlockGame(gameId, password))) {
        return {
          message: "Wrong password",
          invalidField: "password",
          values: { name },
        };
      }
    }
    await addPlayer(playable.game, result.data);
  } catch {
    return { message: "Couldn't join the game, try again", values: { name } };
  }

  // Outside the try: redirect works by throwing
  redirect(playHref(gameId, result.data));
}
