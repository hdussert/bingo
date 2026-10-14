import { CrownIcon } from "lucide-react";
import GameCardLink from "@/components/game/GameCardLink";
import RankSummary from "@/components/game/RankSummary";
import { Badge } from "@/components/ui/badge";
import { rankPlayers } from "@/lib/game/lobby";
import type { JoinedGame } from "@/lib/game/types";

type Props = {
  game: JoinedGame;
  profileId: string;
};

/** A game the player joined, with their place on its leaderboard: tapping it opens their grid. */
export default function JoinedGameCard({ game, profileId }: Props) {
  const rows = rankPlayers(game.players);
  const position = rows.findIndex((row) => row.profileId === profileId);
  return (
    <GameCardLink
      gameId={game.id}
      title={game.title}
      action={
        (game.isEnded || game.isOrganizer) && (
          <>
            {game.isEnded && <Badge variant="secondary">Game over</Badge>}
            {game.isOrganizer && (
              <CrownIcon
                strokeWidth={3}
                className="size-6"
                role="img"
                aria-label="You organize it"
              />
            )}
          </>
        )
      }
    >
      <RankSummary
        row={rows[position]}
        position={position + 1}
        playerCount={rows.length}
      />
    </GameCardLink>
  );
}
