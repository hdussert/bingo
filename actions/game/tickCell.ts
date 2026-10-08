"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { hasAccess } from "@/lib/game/access";
import { findPasswordHash, setCellTicked } from "@/lib/game/games";
import { playerNameSchema } from "@/lib/game/schemas";

const tickSchema = z.object({
  gameId: z.string().min(1).max(20),
  name: playerNameSchema,
  index: z.int().nonnegative(),
  isTicked: z.boolean(),
});

/** Ticks or unticks a cell of the player's grid. */
export async function tickCell(
  gameId: string,
  name: string,
  index: number,
  isTicked: boolean,
): Promise<void> {
  const result = tickSchema.safeParse({ gameId, name, index, isTicked });
  if (!result.success) {
    return;
  }

  const tick = result.data;
  const passwordHash = await findPasswordHash(tick.gameId);
  if (!(await hasAccess(tick.gameId, passwordHash))) {
    return;
  }
  await setCellTicked(tick.gameId, tick.name, tick.index, tick.isTicked);
  revalidatePath(`/play/${tick.gameId}`);
}
