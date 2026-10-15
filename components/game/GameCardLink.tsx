import Link from "next/link";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { NAV_FORWARD } from "@/lib/transitions";

type Props = {
  gameId: string;
  title: string;
  /** Icons or badges on the right of the title, like a private game's lock. */
  action?: React.ReactNode;
  children: React.ReactNode;
};

/** A game in the lists of games: tapping it opens the game. */
export default function GameCardLink({
  gameId,
  title,
  action,
  children,
}: Props) {
  return (
    <Link
      href={`/play/${gameId}`}
      transitionTypes={NAV_FORWARD}
      className="block rounded-xl transition-transform active:scale-[0.98]"
    >
      {/* Tighter than a form card: a list shows more of them at once */}
      <Card className="gap-3 py-5">
        <CardHeader>
          <CardTitle className="text-xl break-words">{title}</CardTitle>
          {action && (
            <CardAction className="row-span-1 flex items-center gap-3 self-center">
              {action}
            </CardAction>
          )}
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </Link>
  );
}
