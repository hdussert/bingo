"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { backHref } from "@/lib/game/links";
import { profileCodeSchema } from "@/lib/profile/schemas";
import { switchProfile } from "@/lib/profile/session";

export type RecoverProfileState = {
  message?: string;
  values?: { code: string };
};

/** Switches this phone to the profile of the code typed in, then goes back to the page the player came from, or shows their games. */
export async function recoverProfile(
  _state: RecoverProfileState,
  formData: FormData,
): Promise<RecoverProfileState> {
  const code = String(formData.get("code") ?? "");
  const result = profileCodeSchema.safeParse(code);
  if (!result.success) {
    return { message: result.error.issues[0].message, values: { code } };
  }

  try {
    if (!(await switchProfile(result.data))) {
      return { message: "No player has this code", values: { code } };
    }
  } catch {
    return { message: "Couldn't check the code, try again", values: { code } };
  }
  // Every page showing who plays on this phone
  revalidatePath("/", "layout");
  // Outside the try: redirect works by throwing
  redirect(backHref(formData.get("back")));
}
