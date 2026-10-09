"use client";

import { CheckIcon, CopyIcon } from "lucide-react";
import { type ComponentProps, useState } from "react";
import { Button } from "@/components/ui/button";

type CopyStatus = "idle" | "copied" | "failed";

type Props = Omit<ComponentProps<typeof Button>, "onClick" | "children"> & {
  url: string;
  /** Shown when the clipboard isn't available, to say where else to find the link. */
  failedLabel: string;
};

/** Copies a link, and says so for a moment. */
export default function CopyLinkButton({ url, failedLabel, ...props }: Props) {
  const [copyStatus, setCopyStatus] = useState<CopyStatus>("idle");
  const labels: Record<CopyStatus, string> = {
    idle: "Copy link",
    copied: "Copied!",
    failed: failedLabel,
  };

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

  return (
    <Button onClick={copyLink} {...props}>
      {copyStatus === "copied" ? (
        <CheckIcon data-icon="inline-start" />
      ) : (
        <CopyIcon data-icon="inline-start" />
      )}
      {labels[copyStatus]}
    </Button>
  );
}
