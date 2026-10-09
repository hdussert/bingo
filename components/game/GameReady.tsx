"use client";

import { CheckIcon, CopyIcon } from "lucide-react";
import ButtonLink from "@/components/game/ButtonLink";
import { useCopyLink } from "@/components/game/useCopyLink";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const COPY_LABELS = {
  idle: "Copy link",
  copied: "Copied!",
  failed: "Copy it from above",
};

type Props = {
  /** The game's path, for the Open game button. */
  href: string;
  /** The game's full link, to share. */
  url: string;
};

/** A new game's link, ready to share. */
export default function GameReady({ href, url }: Props) {
  const { copyStatus, copyLink } = useCopyLink(url);
  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <h1 className="font-heading text-5xl text-cartoon">Game ready!</h1>
      <p className="text-muted-foreground">Share this link with the players.</p>
      <Input
        readOnly
        aria-label="Game link"
        value={url}
        onFocus={(e) => e.target.select()}
        className="text-center"
      />
      <div className="flex w-full flex-col gap-3">
        <Button size="xl" onClick={copyLink}>
          {copyStatus === "copied" ? (
            <CheckIcon data-icon="inline-start" />
          ) : (
            <CopyIcon data-icon="inline-start" />
          )}
          {COPY_LABELS[copyStatus]}
        </Button>
        <ButtonLink href={href} size="xl" variant="outline">
          Open game
        </ButtonLink>
      </div>
    </div>
  );
}
