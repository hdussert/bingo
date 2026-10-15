"use client";

import { CheckIcon, CopyIcon } from "lucide-react";
import { useEffect, useState } from "react";
import ButtonLink from "@/components/game/ButtonLink";
import { copyText } from "@/components/game/copyText";
import { CARD_LABEL_CLASS } from "@/components/game/const";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Long enough to see the tick before the copy icon comes back
const COPIED_MS = 2000;

type Props = {
  /** The profile's code, formatted. */
  code: string;
};

/** The player's code in a code snippet with a copy button, to play as them on another phone. */
export default function CodeCard({ code }: Props) {
  // Set by each successful copy, so a new copy restarts the tick's time
  const [copiedId, setCopiedId] = useState<number | null>(null);

  useEffect(() => {
    if (copiedId === null) {
      return;
    }
    const timeout = setTimeout(() => setCopiedId(null), COPIED_MS);
    return () => clearTimeout(timeout);
  }, [copiedId]);

  async function copyCode() {
    const isCopied = await copyText(code, {
      copied: "Code copied",
      failed: "Couldn't copy the code",
    });
    if (isCopied) {
      setCopiedId((id) => (id ?? 0) + 1);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className={CARD_LABEL_CLASS}>On another phone</CardTitle>
        <CardDescription>
          There, tap “Played on another phone?” and type this code. It unlocks
          your games, so keep it to yourself.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {/* Sunk into the card, like a code block */}
        <div className="flex items-center gap-2 rounded-xl border-2 border-border bg-background bg-clip-padding py-2 pr-2 pl-4">
          <code className="flex-1 font-mono text-xl tracking-wider select-all">
            {code}
          </code>
          <Button
            variant="ghost"
            size="icon-lg"
            onClick={copyCode}
            // The toast says it worked: the label stays put
            aria-label="Copy the code"
            title="Copy the code"
          >
            {copiedId !== null ? (
              <CheckIcon strokeWidth={2.5} className="text-highlight" />
            ) : (
              <CopyIcon strokeWidth={2.5} />
            )}
          </Button>
        </div>
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
