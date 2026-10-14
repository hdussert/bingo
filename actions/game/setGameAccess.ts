"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { findOrganizedGame } from "@/lib/game/access";
import { setGamePasswordHash } from "@/lib/game/games";
import { hashPassword } from "@/lib/game/password";
import { gamePasswordSchema } from "@/lib/game/schemas";

export type SetGameAccessState = {
  message?: string;
  isSaved?: boolean;
};

const accessSchema = z.object({
  isPrivate: z.stringbool(),
  // Empty keeps a private game's current password
  password: z.union([z.literal(""), gamePasswordSchema]),
});

/** Makes a game public, or private with a new password (or its current one), for its organizer. Its players keep playing without the password. */
export async function setGameAccess(
  gameId: string,
  _state: SetGameAccessState,
  formData: FormData,
): Promise<SetGameAccessState> {
  const result = accessSchema.safeParse({
    isPrivate: formData.get("isPrivate"),
    password: formData.get("password") ?? "",
  });
  if (!result.success) {
    return { message: result.error.issues[0].message };
  }
  const { isPrivate, password } = result.data;

  try {
    const organized = await findOrganizedGame(gameId);
    if (!organized) {
      return { message: "Only the organizer can change who can join" };
    }
    if (isPrivate && !password && !organized.isPrivate) {
      return { message: "Choose a password" };
    }
    // Private with no new password: nothing to change
    if (
      (!isPrivate || password) &&
      !(await setGamePasswordHash(
        gameId,
        organized.organizerId,
        isPrivate ? await hashPassword(password) : null,
      ))
    ) {
      return { message: "Only the organizer can change who can join" };
    }
  } catch {
    return { message: "Couldn't save, try again" };
  }
  // The game's pages and the lists of games, with their lock
  revalidatePath("/", "layout");
  return { isSaved: true };
}
