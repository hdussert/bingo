"use client";

import { CheckIcon, LinkIcon, XIcon } from "lucide-react";
import { useCopyLink } from "@/components/game/useCopyLink";
import { CARD_LABEL_CLASS } from "@/components/game/const";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";

const LABELS = {
  idle: "Copy the link",
  copied: "Link copied",
  failed: "Couldn't copy the link",
};

type Props = {
  /** The profile's code, formatted. */
  code: string;
  /** The link that fills the code in on another phone. */
  url: string;
};

/** The player's code, to play as them on another phone. */
export default function CodeCard({ code, url }: Props) {
  const { copyStatus, copyLink } = useCopyLink(url);
  const Icon = { idle: LinkIcon, copied: CheckIcon, failed: XIcon }[copyStatus];

  return (
    <Card className="rounded-xl">
      <CardHeader>
        <CardTitle className={CARD_LABEL_CLASS}>On another phone</CardTitle>
        <CardDescription>
          Open this link there, or type the code: it&apos;s the key to your
          games, keep it to yourself.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Sunk into the card like a code block: read, not typed in */}
        <InputGroup className="border-transparent bg-background">
          <InputGroupInput
            readOnly
            aria-label="Your code"
            value={code}
            onFocus={(e) => e.target.select()}
            className="font-mono text-lg tracking-wider"
          />
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              size="icon-sm"
              onClick={copyLink}
              aria-label={LABELS[copyStatus]}
              title={LABELS[copyStatus]}
            >
              <Icon strokeWidth={2.5} />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </CardContent>
    </Card>
  );
}
