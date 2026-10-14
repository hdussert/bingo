"use server";

import { revalidatePath } from "next/cache";
import { saveGame } from "@/lib/game/games";
import { hashPassword } from "@/lib/game/password";
import {
  newGameSchema,
  parseEvents,
  playerNameSchema,
} from "@/lib/game/schemas";
import { findCurrentProfile, findOrStartProfile } from "@/lib/profile/session";

export type CreateGameState = {
  gameId?: string;
  errors?: string[];
};

/** Validates and saves a new game, organized by this phone's profile (started from the name typed in if it has none); returns its id, or the validation errors. */
export async function createGame(
  _state: CreateGameState,
  formData: FormData,
): Promise<CreateGameState> {
  const result = newGameSchema.safeParse({
    title: formData.get("title"),
    size: Number(formData.get("size")),
    events: parseEvents(String(formData.get("events") ?? "")),
    // The password field only exists while the Private switch is on
    password: formData.get("password"),
  });
  // Only asked when this phone has no profile yet
  const name = formData.has("name")
    ? playerNameSchema.safeParse(formData.get("name"))
    : null;
  const issues = [
    ...(result.error?.issues ?? []),
    ...(name?.error?.issues ?? []),
  ];
  if (!result.success || name?.success === false) {
    return {
      errors: [...new Set(issues.map((issue) => issue.message))],
    };
  }

  const game = result.data;
  try {
    const profile = name
      ? await findOrStartProfile(name.data)
      : await findCurrentProfile();
    if (!profile) {
      // The page had a profile that this phone lost since: it comes back with the name step
      revalidatePath("/new");
      return { errors: ["Enter your name in the last step"] };
    }
    const passwordHash = game.password
      ? await hashPassword(game.password)
      : null;
    // The organizer opens it from their profile, without typing the password
    const gameId = await saveGame(game, passwordHash, profile.id);
    return { gameId };
  } catch {
    return { errors: ["Couldn't save the game, try again"] };
  }
}
