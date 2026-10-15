"use client";

import { LinkIcon } from "lucide-react";
import ButtonLink from "@/components/game/ButtonLink";
import { copyLink } from "@/components/game/copyLink";
import { CARD_LABEL_CLASS } from "@/components/game/const";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Props = {
  /** The profile's code, formatted. */
  code: string;
  /** The link that fills the code in on another phone. */
  url: string;
};

/** The player's code, to play as them on another phone. */
export default function CodeCard({ code, url }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className={CARD_LABEL_CLASS}>On another phone</CardTitle>
        <CardDescription>
          Open this link there, or type the code. It unlocks your games, so keep
          it to yourself.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <p className="text-center font-mono text-2xl tracking-wider select-all">
          {code}
        </p>
        <Button variant="outline" size="lg" onClick={() => copyLink(url)}>
          <LinkIcon strokeWidth={2.5} data-icon="inline-start" />
          Copy the link
        </Button>
        {/* This phone already plays as someone: the way to switch to another player's games */}
        <ButtonLink
          href="/recover?back=/me"
          variant="link"
          size="sm"
          className="self-center"
        >
          Played on another phone?
        </ButtonLink>
      </CardContent>
    </Card>
  );
}
