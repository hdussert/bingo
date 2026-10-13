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
import { peekHref } from "@/lib/game/links";
import { rankPlayers } from "@/lib/game/lobby";
import { findCurrentProfile } from "@/lib/profile/session";
import { NAV_BACK } from "@/lib/transitions";

/** Another player's grid, read-only, for a player of the same game. */
export default async function PeekPage({
  params,
}: PageProps<"/peek/[id]/[player]">) {
  const { id, player: peekedId } = await params;

  const [playable, profile, players] = await Promise.all([
    findPlayableGame(id),
    findCurrentProfile(),
    listPlayers(id),
  ]);
  if (!playable) {
    return <BrokenLink />;
  }
  const { game } = playable;
  const player = findPlayer(players, profile?.id);
  const peeked = findPlayer(players, peekedId);
  // Only for players of the game, peeking at someone else
  if (!player || !peeked || peeked.profileId === player.profileId) {
    redirect(`/play/${id}`);
  }
  const rows = rankPlayers(players);
  const rank = rows.findIndex((row) => row.profileId === peeked.profileId) + 1;
  // The other players in leaderboard order, wrapping around at both ends
  const others = rows.filter((row) => row.profileId !== player.profileId);
  const index = others.findIndex((row) => row.profileId === peeked.profileId);
  const previous = others[(index - 1 + others.length) % others.length];
  const next = others[(index + 1) % others.length];
  const eventTexts = new Map(
    game.events.map((event) => [event.id, event.text]),
  );

  return (
    // Keyed by player: Previous and Next stay on this route, where the root template doesn't slide
    <PageSlide key={peeked.profileId}>
      <main className="mx-auto flex w-full max-w-lg flex-col gap-6 px-4 py-8">
        <BackLink href={`/play/${id}`} />
        <div className="flex flex-col items-center gap-1 text-center">
          <p className="text-muted-foreground">Peeking at</p>
          <PageTitle>
            {peeked.name} (#{rank})
          </PageTitle>
        </div>
        <BingoGrid
          gameId={game.id}
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
              href={peekHref(id, previous.profileId)}
              transitionTypes={NAV_BACK}
              size="xl"
              variant="outline"
            >
              <ArrowLeftIcon strokeWidth={3} data-icon="inline-start" />
              Previous
            </ButtonLink>
            <ButtonLink
              href={peekHref(id, next.profileId)}
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
