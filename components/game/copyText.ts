import { toast } from "sonner";

type Messages = {
  copied?: string;
  failed?: string;
};

/** Copies `text` to the clipboard, says in a toast whether it worked (about a link, unless told otherwise), and returns whether it did. */
export async function copyText(
  text: string,
  { copied = "Link copied", failed = "Couldn't copy the link" }: Messages = {},
): Promise<boolean> {
  // One toast whatever the number of taps: each replaces the one on screen
  const id = "copy";
  try {
    await navigator.clipboard.writeText(text);
    toast.success(copied, { id });
    return true;
  } catch {
    // No clipboard on plain-HTTP pages, or access refused
    toast.error(failed, { id });
    return false;
  }
}
