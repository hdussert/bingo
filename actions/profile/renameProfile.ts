"use server";

import { revalidatePath } from "next/cache";
import { playerNameSchema } from "@/lib/game/schemas";
import { renameProfile as saveName } from "@/lib/profile/profiles";
import { findCurrentProfile } from "@/lib/profile/session";

export type RenameProfileState = {
  message?: string;
  values?: { name: string };
  isSaved?: boolean;
};

/** Renames the current player in every game they joined. */
export async function renameProfile(
  _state: RenameProfileState,
  formData: FormData,
): Promise<RenameProfileState> {
  const name = String(formData.get("name") ?? "");
  const result = playerNameSchema.safeParse(name);
  if (!result.success) {
    return { message: result.error.issues[0].message, values: { name } };
  }

  try {
    const profile = await findCurrentProfile();
    if (!profile) {
      return { message: "Join a game first", values: { name } };
    }
    await saveName(profile.id, result.data);
  } catch {
    return {
      message: "Couldn't change your name, try again",
      values: { name },
    };
  }
  // Every page showing the name: the games, their leaderboards and grids
  revalidatePath("/", "layout");
  return { isSaved: true };
}
