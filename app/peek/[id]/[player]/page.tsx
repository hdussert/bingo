import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { redirect } from "next/navigation";
import AutoRefresh from "@/components/game/AutoRefresh";
import BackLink from "@/components/game/BackLink";
import BingoGrid from "@/components/game/BingoGrid";
import BrokenLink from "@/components/game/BrokenLink";
import ButtonLink from "@/components/game/ButtonLink";
import PageSlide from "@/components/game/PageSlide";
import PageTitle from "@/components/game/PageTitle";
import { findPlayableGame } from "@/lib/game/access";
import { listPlayers } from "@/lib/game/games";
import { findPlayer } from "@/lib/game/grid";
import { peekHref, playHref } from "@/lib/game/links";
import { rankPlayers } from "@/lib/game/lobby";
import { NAV_BACK } from "@/lib/transitions";

/** Another player's grid, read-only, for a player of the same game. */
export default async function PeekPage({
  params,
  searchParams,
}: PageProps<"/peek/[id]/[player]">) {
  const { id, player: peekedKey } = await params;
  const { name } = await searchParams;
  const playerName = typeof name === "string" ? name.trim() : "";

  const [playable, players] = await Promise.all([
    findPlayableGame(id),
    playerName ? listPlayers(id) : [],
  ]);
  if (!playable) {
    return <BrokenLink />;
  }
  const { game, canPlay } = playable;
  const player = findPlayer(players, playerName);
  // The param arrives still percent-encoded, as peekHref built it
  const peeked = findPlayer(players, decodeURIComponent(peekedKey));
  // Only for players who can see the game (its password unlocked on this phone, for a private one)
  if (!canPlay || !player) {
    redirect(`/play/${id}`);
  }
  const myGridHref = playHref(id, player.name);
  if (!peeked || peeked.nameKey === player.nameKey) {
    redirect(myGridHref);
  }
  const rows = rankPlayers(players);
  const rank = rows.findIndex((row) => row.nameKey === peeked.nameKey) + 1;
  // The other players in leaderboard order, wrapping around at both ends
  const others = rows.filter((row) => row.nameKey !== player.nameKey);
  const index = others.findIndex((row) => row.nameKey === peeked.nameKey);
  const previous = others[(index - 1 + others.length) % others.length];
  const next = others[(index + 1) % others.length];
  const eventTexts = new Map(
    game.events.map((event) => [event.id, event.text]),
  );

  return (
    // Keyed by player: Previous and Next stay on this route, where the root template doesn't slide
    <PageSlide key={peeked.nameKey}>
      <main className="mx-auto flex w-full max-w-lg flex-col gap-6 px-4 py-8">
        <BackLink href={myGridHref} />
        <div className="flex flex-col items-center gap-1 text-center">
          <p className="text-muted-foreground">Peeking at</p>
          <PageTitle>
            {peeked.name} (#{rank})
          </PageTitle>
        </div>
        <BingoGrid
          gameId={game.id}
          playerName={peeked.name}
          size={game.size}
          isReadOnly
          cells={peeked.grid.map((cell) => ({
            text: eventTexts.get(cell.eventId) ?? "",
            isTicked: cell.isTicked,
          }))}
        />
        {/* Only when there's someone else to peek at */}
        {others.length > 1 && (
          <div className="flex justify-center gap-3">
            <ButtonLink
              href={peekHref(id, player.name, previous.nameKey)}
              transitionTypes={NAV_BACK}
              size="xl"
              variant="outline"
            >
              <ArrowLeftIcon strokeWidth={3} data-icon="inline-start" />
              Previous
            </ButtonLink>
            <ButtonLink
              href={peekHref(id, player.name, next.nameKey)}
              size="xl"
              variant="outline"
            >
              Next
              <ArrowRightIcon strokeWidth={3} data-icon="inline-end" />
            </ButtonLink>
          </div>
        )}
        <AutoRefresh />
      </main>
    </PageSlide>
  );
}
