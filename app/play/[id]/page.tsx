import { Grid3x3Icon, LockIcon } from "lucide-react";
import Link from "next/link";
import BackLink from "@/components/game/BackLink";
import BingoGrid from "@/components/game/BingoGrid";
import BrokenLink from "@/components/game/BrokenLink";
import CopyLinkIconButton from "@/components/game/CopyLinkIconButton";
import JoinForm from "@/components/game/JoinForm";
import LeaderboardDrawer from "@/components/game/LeaderboardDrawer";
import AutoRefresh from "@/components/game/AutoRefresh";
import Lobby from "@/components/game/Lobby";
import PlayerRank from "@/components/game/PlayerRank";
import { findPlayableGame } from "@/lib/game/access";
import { listPlayers } from "@/lib/game/games";
import { toNameKey } from "@/lib/game/grid";
import { playHref } from "@/lib/game/links";
import { rankPlayers } from "@/lib/game/lobby";
import PageTitle from "@/components/game/PageTitle";
import { absoluteUrl } from "@/lib/url";

export default async function PlayPage({
  params,
  searchParams,
}: PageProps<"/play/[id]">) {
  const { id } = await params;
  const { name, peek } = await searchParams;
  const playerName = typeof name === "string" ? name.trim() : "";
  const peekKey = typeof peek === "string" ? toNameKey(peek) : undefined;

  // Visitors who haven't joined only see the join form: no need for the players
  const [playable, players, url] = await Promise.all([
    findPlayableGame(id),
    playerName ? listPlayers(id) : [],
    // The game's link without ?name=, for inviting others
    absoluteUrl(`/play/${id}`),
  ]);
  if (!playable) {
    return <BrokenLink />;
  }
  // A private game shows only its join form until this phone enters the password
  const { game, isPrivate, canPlay } = playable;
  const player = canPlay
    ? players.find((candidate) => candidate.nameKey === toNameKey(playerName))
    : undefined;
  // Another player's grid, shown read-only in place of the player's own
  const peeked = player
    ? players.find(
        (candidate) =>
          candidate.nameKey === peekKey && candidate.nameKey !== player.nameKey,
      )
    : undefined;
  const rows = rankPlayers(players);
  const position = rows.findIndex((row) => row.nameKey === player?.nameKey);
  const eventTexts = new Map(
    game.events.map((event) => [event.id, event.text]),
  );

  return (
    <main className="mx-auto flex w-full max-w-lg flex-col gap-6 px-4 py-8">
      <div className="flex items-center justify-between">
        <BackLink href="/games" />
        {player && (
          // Lines the trophy up with the content edge, like the back arrow
          <div className="-mr-3 flex items-center">
            <CopyLinkIconButton url={url} />
            <LeaderboardDrawer playerCount={players.length}>
              <Lobby
                gameId={game.id}
                playerName={player.name}
                rows={rows}
                playerKey={player.nameKey}
                peekKey={peeked?.nameKey}
              />
            </LeaderboardDrawer>
          </div>
        )}
      </div>
      <div className="flex flex-col items-center gap-2 text-center">
        <PageTitle>{game.title}</PageTitle>
        {!player && (
          <p className="flex items-center gap-5 text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Grid3x3Icon className="size-4" />
              {game.size}×{game.size}
            </span>
            {isPrivate && (
              <span className="flex items-center gap-1.5">
                <LockIcon strokeWidth={3} className="size-4" />
                Private
              </span>
            )}
          </p>
        )}
        {player && peeked && (
          <p className="text-muted-foreground">
            Peeking at{" "}
            <span className="font-semibold text-foreground">{peeked.name}</span>
            &apos;s grid ·{" "}
            <Link
              href={playHref(game.id, player.name)}
              className="text-primary underline-offset-4 hover:underline"
            >
              Back to my grid
            </Link>
          </p>
        )}
        {player && !peeked && (
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
            // A fresh grid when switching between players, without their optimistic ticks or banner
            key={(peeked ?? player).nameKey}
            gameId={game.id}
            playerName={player.name}
            size={game.size}
            isReadOnly={Boolean(peeked)}
            cells={(peeked ?? player).grid.map((cell) => ({
              text: eventTexts.get(cell.eventId) ?? "",
              isTicked: cell.isTicked,
            }))}
          />
          <PlayerRank
            row={rows[position]}
            position={position + 1}
            playerCount={players.length}
          />
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
