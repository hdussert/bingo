import { z } from "zod";

/** A profile code as typed: dashes and spaces are allowed, see `normalizeCode`. */
export const profileCodeSchema = z
  .string()
  .trim()
  .min(1, "Enter your code")
  .max(30, "That's longer than a code");
