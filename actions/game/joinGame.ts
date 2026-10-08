"use server";

import { redirect } from "next/navigation";
import { grantAccess, hasAccess } from "@/lib/game/access";
import { addPlayer, findGame } from "@/lib/game/games";
import { verifyPassword } from "@/lib/game/password";
import { playerNameSchema } from "@/lib/game/schemas";

export type JoinGameState = {
  message?: string;
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
    return { message: result.error.issues[0].message, values: { name } };
  }

  try {
    const game = await findGame(gameId);
    if (!game) {
      return { message: "This game doesn't exist anymore", values: { name } };
    }
    if (game.passwordHash && !(await hasAccess(game.id, game.passwordHash))) {
      const password = String(formData.get("password") ?? "");
      if (!verifyPassword(password, game.passwordHash)) {
        return { message: "Wrong password", values: { name } };
      }
      await grantAccess(game.id, game.passwordHash);
    }
    await addPlayer(game, result.data);
  } catch {
    return { message: "Couldn't join the game, try again", values: { name } };
  }

  // Outside the try: redirect works by throwing
  redirect(`/play/${gameId}?name=${encodeURIComponent(result.data)}`);
}
