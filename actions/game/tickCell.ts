"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { setCellTicked } from "@/lib/game/games";
import { findCurrentProfile } from "@/lib/profile/session";

const tickSchema = z.object({
  gameId: z.string().min(1).max(20),
  index: z.int().nonnegative(),
  isTicked: z.boolean(),
});

/** Ticks or unticks a cell of the current player's grid. */
export async function tickCell(
  gameId: string,
  index: number,
  isTicked: boolean,
): Promise<void> {
  const result = tickSchema.safeParse({ gameId, index, isTicked });
  if (!result.success) {
    return;
  }

  const profile = await findCurrentProfile();
  if (!profile) {
    return;
  }
  const tick = result.data;
  // Only a player of the game has a grid there to tick
  await setCellTicked(tick.gameId, profile.id, tick.index, tick.isTicked);
  revalidatePath(`/play/${tick.gameId}`);
}
