"use client";

import { useState } from "react";

export type CopyStatus = "idle" | "copied" | "failed";

/** Copies `url` to the clipboard, with a status that says "copied" for a moment. */
export function useCopyLink(url: string) {
  const [copyStatus, setCopyStatus] = useState<CopyStatus>("idle");

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopyStatus("copied");
      setTimeout(() => setCopyStatus("idle"), 2000);
    } catch {
      // No clipboard on plain-HTTP pages, or access refused
      setCopyStatus("failed");
    }
  }

  return { copyStatus, copyLink };
}
