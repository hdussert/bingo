"use server";

import { redirect } from "next/navigation";
import { switchProfile } from "@/lib/profile/session";

export type RecoverProfileState = {
  message?: string;
  values?: { code: string };
};

/** Switches this phone to the profile of the code typed in, then shows its games. */
export async function recoverProfile(
  _state: RecoverProfileState,
  formData: FormData,
): Promise<RecoverProfileState> {
  const code = String(formData.get("code") ?? "");
  try {
    if (!(await switchProfile(code))) {
      return { message: "No player has this code", values: { code } };
    }
  } catch {
    return { message: "Couldn't check the code, try again", values: { code } };
  }
  // Outside the try: redirect works by throwing
  redirect("/games");
}
