"use client";

import { CheckIcon, LinkIcon, XIcon } from "lucide-react";
import { useCopyLink } from "@/components/game/useCopyLink";
import { CARD_LABEL_CLASS } from "@/components/game/const";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const LABELS = {
  idle: "Copy the link",
  copied: "Link copied",
  failed: "Couldn't copy",
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
      <CardContent className="flex flex-col gap-4">
        <p className="text-center font-mono text-2xl tracking-wider select-all">
          {code}
        </p>
        <Button variant="outline" size="lg" onClick={copyLink}>
          <Icon strokeWidth={2.5} data-icon="inline-start" />
          {LABELS[copyStatus]}
        </Button>
      </CardContent>
    </Card>
  );
}
