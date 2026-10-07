import { Link2OffIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { NAV_FORWARD } from "@/lib/transitions";

/** Shown for a game link that leads nowhere. */
export default function BrokenLink() {
  return (
    <main className="mx-auto flex w-full max-w-lg flex-1 flex-col px-4 py-8">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Link2OffIcon />
          </EmptyMedia>
          <EmptyTitle>This game link is broken</EmptyTitle>
          <EmptyDescription>
            Ask the organizer for the link again, or create your own game.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button
            nativeButton={false}
            render={<Link href="/new" transitionTypes={NAV_FORWARD} />}
          >
            Create a game
          </Button>
        </EmptyContent>
      </Empty>
    </main>
  );
}
