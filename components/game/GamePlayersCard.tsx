import { CARD_LABEL_CLASS } from "@/components/game/const";
import RemovePlayerForm from "@/components/game/RemovePlayerForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { pluralize } from "@/lib/game/format";
import type { Player } from "@/lib/game/types";

type Props = {
  gameId: string;
  /** The organizer's profile id: they can't remove themselves. */
  organizerId: string;
  players: Player[];
};

/** The game's players, each with a button to remove them, for the organizer. */
export default function GamePlayersCard({
  gameId,
  organizerId,
  players,
}: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className={CARD_LABEL_CLASS}>
          {pluralize(players.length, "player")}
        </CardTitle>
        <CardDescription>
          A removed player loses their grid. They can join again, unless a new
          password keeps them out.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {players.length === 0 ? (
          <p className="text-muted-foreground">Nobody joined yet.</p>
        ) : (
          <ul className="flex flex-col divide-y">
            {players.map((player) => (
              <li
                key={player.profileId}
                className="flex min-h-12 items-center justify-between gap-3 py-1"
              >
                <span className="truncate font-medium">{player.name}</span>
                {player.profileId === organizerId ? (
                  <span className="text-sm text-muted-foreground">You</span>
                ) : (
                  <RemovePlayerForm
                    gameId={gameId}
                    profileId={player.profileId}
                    name={player.name}
                  />
                )}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
