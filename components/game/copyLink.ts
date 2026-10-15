import { toast } from "sonner";

/** Copies `url` to the clipboard, and says in a toast whether it worked. */
export async function copyLink(
  url: string,
  failedMessage = "Couldn't copy the link",
) {
  // One toast whatever the number of taps: each replaces the one on screen
  const id = "copy-link";
  try {
    await navigator.clipboard.writeText(url);
    toast.success("Link copied", { id });
  } catch {
    // No clipboard on plain-HTTP pages, or access refused
    toast.error(failedMessage, { id });
  }
}
