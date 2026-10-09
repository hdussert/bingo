"use client";

import { CheckIcon, LinkIcon, XIcon } from "lucide-react";
import { useCopyLink } from "@/components/game/useCopyLink";
import { Button } from "@/components/ui/button";

const LABELS = {
  idle: "Copy the game's link",
  copied: "Link copied",
  failed: "Couldn't copy the link",
};

/** Copies the game's link from the header, a check mark saying it worked. */
export default function CopyLinkIconButton({ url }: { url: string }) {
  const { copyStatus, copyLink } = useCopyLink(url);
  const Icon = { idle: LinkIcon, copied: CheckIcon, failed: XIcon }[copyStatus];

  return (
    <Button
      variant="ghost"
      size="icon-xl"
      onClick={copyLink}
      aria-label={LABELS[copyStatus]}
      title={LABELS[copyStatus]}
    >
      <Icon strokeWidth={2.5} />
    </Button>
  );
}
