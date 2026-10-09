"use client";

import { useEffect, useRef, useState } from "react";

type CopyStatus = "idle" | "copied" | "failed";

/** Copies `url` to the clipboard, with a status that says "copied" or "failed" for a moment. */
export function useCopyLink(url: string) {
  const [copyStatus, setCopyStatus] = useState<CopyStatus>("idle");
  const resetTimeout = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(resetTimeout.current), []);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopyStatus("copied");
    } catch {
      // No clipboard on plain-HTTP pages, or access refused
      setCopyStatus("failed");
    }
    // A second tap restarts the delay instead of being cut short by the first one
    clearTimeout(resetTimeout.current);
    resetTimeout.current = setTimeout(() => setCopyStatus("idle"), 2000);
  }

  return { copyStatus, copyLink };
}
