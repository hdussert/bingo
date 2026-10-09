"use client";

import { CheckIcon, CopyIcon } from "lucide-react";
import type { ComponentProps } from "react";
import { type CopyStatus, useCopyLink } from "@/components/game/useCopyLink";
import { Button } from "@/components/ui/button";

type Props = Omit<ComponentProps<typeof Button>, "onClick" | "children"> & {
  url: string;
  /** Shown when the clipboard isn't available, to say where else to find the link. */
  failedLabel: string;
};

/** Copies a link, and says so for a moment. */
export default function CopyLinkButton({ url, failedLabel, ...props }: Props) {
  const { copyStatus, copyLink } = useCopyLink(url);
  const labels: Record<CopyStatus, string> = {
    idle: "Copy link",
    copied: "Copied!",
    failed: failedLabel,
  };

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
