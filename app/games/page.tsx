import { ClockIcon, Grid3x3Icon, LockIcon, UsersIcon } from "lucide-react";
import { connection } from "next/server";
import PageHeader from "@/components/game/PageHeader";
import RefreshButton from "@/components/game/RefreshButton";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import GameCardLink from "@/components/game/GameCardLink";
import JoinedGameCard from "@/components/game/JoinedGameCard";
import { listJoinedGames, listRunningGames } from "@/lib/game/games";
import { findCurrentProfile } from "@/lib/profile/session";
import ButtonLink from "@/components/game/ButtonLink";
import PageTitle from "@/components/game/PageTitle";
import { SECTION_LABEL_CLASS } from "@/components/game/const";
import { formatTimeAgo, pluralize } from "@/lib/game/format";

export default async function GamesPage() {
  // Read the games on every visit, not once at build time
  await connection();
  const [runningGames, profile] = await Promise.all([
    listRunningGames(),
    findCurrentProfile(),
  ]);
  const joinedGames = profile ? await listJoinedGames(profile.id) : [];
  const joinedIds = new Set(joinedGames.map((game) => game.id));
  const games = runningGames.filter((game) => !joinedIds.has(game.id));
  const hasJoined = joinedGames.length > 0;

  return (
    <main className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-8 px-4 py-8">
      <div className="flex flex-col items-start gap-2">
        <PageHeader back="/">
          <RefreshButton />
        </PageHeader>
        <PageTitle>Join a game</PageTitle>
        <p className="text-muted-foreground">Tap a game to get your grid.</p>
      </div>
      {profile && hasJoined && (
        <section className="flex flex-col gap-3">
          <h2 className={SECTION_LABEL_CLASS}>Your games</h2>
          <ul className="flex flex-col gap-3">
            {joinedGames.map((game) => (
              <li key={game.id}>
                <JoinedGameCard game={game} profileId={profile.id} />
              </li>
            ))}
          </ul>
        </section>
      )}
      <section className="flex flex-col gap-3">
        {hasJoined && <h2 className={SECTION_LABEL_CLASS}>Other games</h2>}
        {games.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Grid3x3Icon />
              </EmptyMedia>
              <EmptyTitle>
                {hasJoined ? "No other game running" : "No game running"}
              </EmptyTitle>
              <EmptyDescription>
                Ask the organizer for the link, or create your own game.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <ButtonLink href="/new">Create a game</ButtonLink>
            </EmptyContent>
          </Empty>
        ) : (
          <ul className="flex flex-col gap-3">
            {games.map((game) => (
              <li key={game.id}>
                <GameCardLink
                  gameId={game.id}
                  title={game.title}
                  action={
                    game.isPrivate && (
                      <LockIcon
                        strokeWidth={3}
                        className="size-6"
                        aria-label="Private game"
                      />
                    )
                  }
                >
                  <div className="flex flex-wrap gap-x-5 gap-y-2 text-muted-foreground">
                    <span className="flex items-center gap-1.5 whitespace-nowrap">
                      <Grid3x3Icon className="size-4" />
                      {game.size}×{game.size}
                    </span>
                    <span className="flex items-center gap-1.5 whitespace-nowrap">
                      <UsersIcon className="size-4" />
                      {pluralize(game.playerCount, "player")}
                    </span>
                    <span className="flex items-center gap-1.5 whitespace-nowrap">
                      <ClockIcon className="size-4" />
                      {formatTimeAgo(game.lastActivityAt)}
                    </span>
                  </div>
                </GameCardLink>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
