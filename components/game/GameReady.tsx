"use client";

import ButtonLink from "@/components/game/ButtonLink";
import CopyLinkButton from "@/components/game/CopyLinkButton";
import { Input } from "@/components/ui/input";

type Props = {
  /** The game's path, for the Open game button. */
  href: string;
  /** The game's full link, to share. */
  url: string;
};

/** A new game's link, ready to share. */
export default function GameReady({ href, url }: Props) {
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
        <CopyLinkButton url={url} failedLabel="Copy it from above" size="xl" />
        <ButtonLink href={href} size="xl" variant="outline">
          Open game
        </ButtonLink>
      </div>
    </div>
  );
}
