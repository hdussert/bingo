"use client";

import { CheckIcon, CopyIcon } from "lucide-react";
import { useState } from "react";
import ButtonLink from "@/components/game/ButtonLink";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type CopyStatus = "idle" | "copied" | "failed";

const COPY_LABELS: Record<CopyStatus, string> = {
  idle: "Copy link",
  copied: "Copied!",
  failed: "Copy it from above",
};

type Props = {
  gameId: string;
};

/** Shown once a game is created: its link, ready to share. */
export default function GameReady({ gameId }: Props) {
  const [copyStatus, setCopyStatus] = useState<CopyStatus>("idle");
  const href = `/play/${gameId}`;
  const url = new URL(href, location.origin).toString();

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopyStatus("copied");
      setTimeout(() => setCopyStatus("idle"), 2000);
    } catch {
      // No clipboard on plain-HTTP pages, or access refused: the link is in the field above
      setCopyStatus("failed");
    }
  }

  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <h2 className="font-heading text-5xl text-cartoon">Game ready!</h2>
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
