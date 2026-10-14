import Link from "next/link";
import RankSummary from "@/components/game/RankSummary";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { rankPlayers } from "@/lib/game/lobby";
import type { JoinedGame } from "@/lib/game/types";
import { NAV_FORWARD } from "@/lib/transitions";

type Props = {
  game: JoinedGame;
  profileId: string;
};

/** A game the player joined, with their place on its leaderboard: tapping it opens their grid. */
export default function JoinedGameCard({ game, profileId }: Props) {
  const rows = rankPlayers(game.players);
  const position = rows.findIndex((row) => row.profileId === profileId);
  return (
    <Link
      href={`/play/${game.id}`}
      transitionTypes={NAV_FORWARD}
      className="block rounded-2xl transition-transform active:scale-[0.98]"
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl break-words">{game.title}</CardTitle>
          {game.isEnded && (
            <CardAction className="row-span-1 self-center">
              <Badge variant="secondary">Ended</Badge>
            </CardAction>
          )}
        </CardHeader>
        <CardContent>
          <RankSummary
            row={rows[position]}
            position={position + 1}
            playerCount={rows.length}
          />
        </CardContent>
      </Card>
    </Link>
  );
}
