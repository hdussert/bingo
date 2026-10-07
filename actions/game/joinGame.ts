"use server";

import { redirect } from "next/navigation";
import { addPlayer, findGame } from "@/lib/game/games";
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

  const game = await findGame(gameId);
  if (!game) {
    return { message: "This game doesn't exist anymore", values: { name } };
  }

  await addPlayer(game, result.data);
  redirect(`/play/${gameId}?name=${encodeURIComponent(result.data)}`);
}
