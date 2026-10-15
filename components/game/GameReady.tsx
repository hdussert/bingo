"use client";

import { CopyIcon } from "lucide-react";
import ButtonLink from "@/components/game/ButtonLink";
import { copyLink } from "@/components/game/copyLink";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Props = {
  /** The game's path, for the Go to my grid button. */
  href: string;
  /** The game's full link, to share. */
  url: string;
};

/** A new game's link, ready to share. */
export default function GameReady({ href, url }: Props) {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="font-heading text-5xl text-cartoon">Game ready!</h1>
        <p className="text-muted-foreground">
          Send this link to your friends so they can join.
        </p>
      </div>
      <div className="flex flex-col gap-4">
        <Input
          readOnly
          aria-label="Game link"
          value={url}
          onFocus={(e) => e.target.select()}
          className="text-center"
        />
        <div className="flex w-full flex-col gap-3">
          <Button
            size="xl"
            onClick={() => copyLink(url, "Copy it from the field above")}
          >
            <CopyIcon data-icon="inline-start" />
            Copy link
          </Button>
          <ButtonLink href={href} size="xl" variant="outline">
            Go to my grid
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
