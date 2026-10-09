import { Grid3x3Icon, LockIcon } from "lucide-react";
import Link from "next/link";
import BackLink from "@/components/game/BackLink";
import BingoGrid from "@/components/game/BingoGrid";
import BrokenLink from "@/components/game/BrokenLink";
import JoinForm from "@/components/game/JoinForm";
import AutoRefresh from "@/components/game/AutoRefresh";
import Lobby from "@/components/game/Lobby";
import { findPlayableGame } from "@/lib/game/access";
import { listPlayers } from "@/lib/game/games";
import { toNameKey } from "@/lib/game/grid";
import { rankPlayers } from "@/lib/game/lobby";
import PageTitle from "@/components/game/PageTitle";

export default async function PlayPage({
  params,
  searchParams,
}: PageProps<"/play/[id]">) {
  const { id } = await params;
  const { name } = await searchParams;
  const playerName = typeof name === "string" ? name.trim() : "";

  // Visitors who haven't joined only see the join form: no need for the players
  const [playable, players] = await Promise.all([
    findPlayableGame(id),
    playerName ? listPlayers(id) : [],
  ]);
  if (!playable) {
    return <BrokenLink />;
  }
  // A private game shows only its join form until this phone enters the password
  const { game, canPlay } = playable;
  const player = canPlay
    ? players.find((candidate) => candidate.nameKey === toNameKey(playerName))
    : undefined;
  const eventTexts = new Map(
    game.events.map((event) => [event.id, event.text]),
  );

  return (
    <main className="mx-auto flex w-full max-w-lg flex-col gap-6 px-4 py-8">
      {!player && <BackLink href="/games" />}
      <div className="flex flex-col items-center gap-2 text-center">
        <PageTitle>{game.title}</PageTitle>
        {!player && (
          <p className="flex items-center gap-5 text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Grid3x3Icon className="size-4" />
              {game.size}×{game.size}
            </span>
            {!canPlay && (
              <span className="flex items-center gap-1.5">
                <LockIcon strokeWidth={3} className="size-4" />
                Private
              </span>
            )}
          </p>
        )}
        {player && (
          <p className="text-muted-foreground">
            Playing as{" "}
            <span className="font-semibold text-foreground">{player.name}</span>{" "}
            ·{" "}
            <Link
              href={`/play/${game.id}`}
              className="text-primary underline-offset-4 hover:underline"
            >
              Not you?
            </Link>
          </p>
        )}
      </div>
      {player ? (
        <>
          <BingoGrid
            gameId={game.id}
            playerName={player.name}
            size={game.size}
            cells={player.grid.map((cell) => ({
              text: eventTexts.get(cell.eventId) ?? "",
              isTicked: cell.isTicked,
            }))}
          />
          <Lobby rows={rankPlayers(players)} playerKey={player.nameKey} />
          <AutoRefresh />
        </>
      ) : (
        <JoinForm
          gameId={game.id}
          defaultName={playerName}
          needsPassword={!canPlay}
        />
      )}
    </main>
  );
}
