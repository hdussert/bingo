import { FlagIcon, Grid3x3Icon, LockIcon, SettingsIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import CenteredPageLayout from "@/components/game/CenteredPageLayout";
import PageHeader from "@/components/game/PageHeader";
import BingoGrid from "@/components/game/BingoGrid";
import BrokenLink from "@/components/game/BrokenLink";
import ButtonLink from "@/components/game/ButtonLink";
import CopyLinkIconButton from "@/components/game/CopyLinkIconButton";
import JoinForm from "@/components/game/JoinForm";
import LeaderboardDrawer from "@/components/game/LeaderboardDrawer";
import AutoRefresh from "@/components/game/AutoRefresh";
import Lobby from "@/components/game/Lobby";
import PlayerRank from "@/components/game/PlayerRank";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { findPlayableGame } from "@/lib/game/access";
import { findGameWithPassword, listPlayers } from "@/lib/game/games";
import { findPlayer } from "@/lib/game/grid";
import { withBackToGame } from "@/lib/game/links";
import { rankPlayers } from "@/lib/game/lobby";
import PageSlide from "@/components/game/PageSlide";
import PageTitle from "@/components/game/PageTitle";
import { NAV_FORWARD } from "@/lib/transitions";
import { absoluteUrl } from "@/lib/url";

/** The game's title and who invites, for the preview of its link in a chat. */
export async function generateMetadata({
  params,
}: PageProps<"/play/[id]">): Promise<Metadata> {
  const { id } = await params;
  const stored = await findGameWithPassword(id);
  if (!stored) {
    return {};
  }
  const { title, creator } = stored.game;
  const description = creator
    ? `${creator.name} invites you to play bingo with friends.`
    : "You're invited to play bingo with friends.";
  return {
    title,
    description,
    openGraph: { title, description, siteName: "Bingo" },
  };
}

export default async function PlayPage({ params }: PageProps<"/play/[id]">) {
  const { id } = await params;

  const [playable, players, url] = await Promise.all([
    findPlayableGame(id),
    listPlayers(id),
    absoluteUrl(`/play/${id}`),
  ]);
  if (!playable) {
    return <BrokenLink />;
  }
  const { game, profile, isPrivate, isOrganizer, isUnlocked } = playable;
  const { isEnded } = game;
  // Joining a private game took its password: no need to unlock it again on another phone
  const player = findPlayer(players, profile?.id);
  const rows = rankPlayers(players);
  const position = rows.findIndex((row) => row.profileId === player?.profileId);
  const eventTexts = new Map(
    game.events.map((event) => [event.id, event.text]),
  );

  return (
    // Keyed by screen: joining stays on this route, where the root template doesn't slide
    <PageSlide key={player ? "grid" : "join"}>
      <CenteredPageLayout
        header={
          <PageHeader back="/games">
            {isOrganizer && (
              <ButtonLink
                href={`/play/${game.id}/admin`}
                variant="ghost"
                size="icon-xl"
                aria-label="Manage the game"
              >
                <SettingsIcon strokeWidth={2.5} />
              </ButtonLink>
            )}
            {player && (
              <>
                <CopyLinkIconButton url={url} />
                <LeaderboardDrawer playerCount={players.length}>
                  <Lobby
                    gameId={game.id}
                    playerId={player.profileId}
                    rows={rows}
                  />
                </LeaderboardDrawer>
              </>
            )}
          </PageHeader>
        }
      >
        <div className="flex flex-col gap-8">
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
                {game.creator && <span>by {game.creator.name}</span>}
              </p>
            )}
            {player &&
              (isEnded ? (
                <p className="flex items-center gap-1.5 font-semibold text-highlight">
                  <FlagIcon strokeWidth={3} className="size-4" />
                  Game over
                </p>
              ) : (
                <p className="text-muted-foreground">
                  Playing as{" "}
                  <span className="font-semibold text-foreground">
                    {player.name}
                  </span>{" "}
                  ·{" "}
                  <Link
                    href={withBackToGame("/me", game.id)}
                    transitionTypes={NAV_FORWARD}
                    className="text-primary underline-offset-4 hover:underline"
                  >
                    Change
                  </Link>
                </p>
              ))}
          </div>
          {player ? (
            <div className="flex flex-col gap-4">
              <BingoGrid
                gameId={game.id}
                size={game.size}
                isReadOnly={isEnded}
                cells={player.grid.map((cell) => ({
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
            </div>
          ) : isEnded ? (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <FlagIcon />
                </EmptyMedia>
                <EmptyTitle>Game over</EmptyTitle>
                <EmptyDescription>Nobody can join anymore.</EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <JoinForm
              gameId={game.id}
              profileName={profile?.name ?? null}
              needsPassword={!isUnlocked}
            />
          )}
        </div>
      </CenteredPageLayout>
    </PageSlide>
  );
}
