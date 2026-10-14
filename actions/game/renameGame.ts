"use server";

import { revalidatePath } from "next/cache";
import { findOrganizedGame } from "@/lib/game/access";
import { renameGame as saveTitle } from "@/lib/game/games";
import { gameTitleSchema } from "@/lib/game/schemas";

export type RenameGameState = {
  message?: string;
  values?: { title: string };
  /** The new title, once saved. */
  savedTitle?: string;
};

/** Renames a game, for its organizer. */
export async function renameGame(
  gameId: string,
  _state: RenameGameState,
  formData: FormData,
): Promise<RenameGameState> {
  const title = String(formData.get("title") ?? "");
  const result = gameTitleSchema.safeParse(title);
  if (!result.success) {
    return { message: result.error.issues[0].message, values: { title } };
  }

  try {
    if (!(await findOrganizedGame(gameId))) {
      return {
        message: "Only the organizer can rename the game",
        values: { title },
      };
    }
    await saveTitle(gameId, result.data);
  } catch {
    return {
      message: "Couldn't rename the game, try again",
      values: { title },
    };
  }
  // The game's pages and the lists of games
  revalidatePath("/", "layout");
  return { savedTitle: result.data };
}
