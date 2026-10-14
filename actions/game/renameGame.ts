"use server";

import { revalidatePath } from "next/cache";
import { renameGame as saveTitle } from "@/lib/game/games";
import { gameTitleSchema } from "@/lib/game/schemas";
import { findCurrentProfile } from "@/lib/profile/session";

export type RenameGameState = {
  message?: string;
  values?: { title: string };
  isSaved?: boolean;
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
    const profile = await findCurrentProfile();
    if (!profile || !(await saveTitle(gameId, profile.id, result.data))) {
      return {
        message: "Only the organizer can rename the game",
        values: { title },
      };
    }
  } catch {
    return {
      message: "Couldn't rename the game, try again",
      values: { title },
    };
  }
  // The game's pages and the lists of games
  revalidatePath("/", "layout");
  return { isSaved: true };
}
