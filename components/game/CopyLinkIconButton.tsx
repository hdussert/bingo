"use client";

import { LinkIcon } from "lucide-react";
import { copyLink } from "@/components/game/copyLink";
import { Button } from "@/components/ui/button";

/** Copies the game's link from the header. */
export default function CopyLinkIconButton({ url }: { url: string }) {
  return (
    <Button
      variant="ghost"
      size="icon-xl"
      onClick={() => copyLink(url)}
      aria-label="Copy the game's link"
      title="Copy the game's link"
    >
      <LinkIcon strokeWidth={2.5} />
    </Button>
  );
}
