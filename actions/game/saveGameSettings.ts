"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { findOrganizedGame } from "@/lib/game/access";
import { saveGameSettings as saveSettings } from "@/lib/game/games";
import { hashPassword } from "@/lib/game/password";
import { gamePasswordSchema, gameTitleSchema } from "@/lib/game/schemas";

export type SaveGameSettingsState = {
  message?: string;
  /** The field the message is about, if any. */
  invalidField?: "title" | "password";
  isSaved?: boolean;
};

const settingsSchema = z.object({
  title: gameTitleSchema,
  isPrivate: z.stringbool(),
  // Empty keeps a private game's current password
  password: z.union([z.literal(""), gamePasswordSchema]),
});

/** Saves a game's title and who can join (public, or private with a new password or its current one), for its organizer. Its players keep playing without the password. */
export async function saveGameSettings(
  gameId: string,
  _state: SaveGameSettingsState,
  formData: FormData,
): Promise<SaveGameSettingsState> {
  const result = settingsSchema.safeParse({
    title: formData.get("title") ?? "",
    isPrivate: formData.get("isPrivate"),
    password: formData.get("password") ?? "",
  });
  if (!result.success) {
    const issue = result.error.issues[0];
    const field = issue.path[0];
    return {
      message: issue.message,
      invalidField:
        field === "title" || field === "password" ? field : undefined,
    };
  }
  const { title, isPrivate, password } = result.data;

  try {
    const organized = await findOrganizedGame(gameId);
    if (!organized) {
      return { message: "Only the organizer can change the game" };
    }
    if (isPrivate && !password && !organized.isPrivate) {
      return { message: "Choose a password", invalidField: "password" };
    }
    // Private with no new password keeps the current one
    const passwordHash = !isPrivate
      ? null
      : password
        ? await hashPassword(password)
        : undefined;
    if (
      !(await saveSettings(gameId, organized.organizerId, {
        title,
        passwordHash,
      }))
    ) {
      return { message: "Only the organizer can change the game" };
    }
  } catch {
    return { message: "Couldn't save, try again" };
  }
  // The game's pages and the lists of games, with their title and lock
  revalidatePath("/", "layout");
  return { isSaved: true };
}
