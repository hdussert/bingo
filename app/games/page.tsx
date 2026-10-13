import {
  ClockIcon,
  Grid3x3Icon,
  LockIcon,
  UserIcon,
  UsersIcon,
} from "lucide-react";
import Link from "next/link";
import { connection } from "next/server";
import BackLink from "@/components/game/BackLink";
import RefreshButton from "@/components/game/RefreshButton";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import JoinedGameCard from "@/components/game/JoinedGameCard";
import { listJoinedGames, listRunningGames } from "@/lib/game/games";
import { findCurrentProfile } from "@/lib/profile/session";
import { NAV_FORWARD } from "@/lib/transitions";
import ButtonLink from "@/components/game/ButtonLink";
import PageTitle from "@/components/game/PageTitle";
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

  return (
    <main className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-6 px-4 py-8">
      <div className="flex flex-col items-start gap-2">
        <div className="flex w-full items-center justify-between">
          <BackLink href="/" />
          {profile && (
            <ButtonLink
              href="/me"
              variant="ghost"
              size="icon-xl"
              // Lines the icon up with the content edge, like the back arrow
              className="-mr-3"
              aria-label={`${profile.name}: your name`}
            >
              <UserIcon strokeWidth={3} />
            </ButtonLink>
          )}
        </div>
        <div className="flex w-full items-center justify-between gap-4">
          <PageTitle>Join a game</PageTitle>
          <RefreshButton />
        </div>
      </div>
      {profile && joinedGames.length > 0 && (
        <section className="flex flex-col gap-4">
          <h2 className="font-heading text-2xl">Your games</h2>
          <ul className="flex flex-col gap-4">
            {joinedGames.map((game) => (
              <li key={game.id}>
                <JoinedGameCard game={game} profileId={profile.id} />
              </li>
            ))}
          </ul>
        </section>
      )}
      {joinedGames.length > 0 && (
        <h2 className="-mb-2 font-heading text-2xl">Other games</h2>
      )}
      {games.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Grid3x3Icon />
            </EmptyMedia>
            <EmptyTitle>
              {joinedGames.length > 0
                ? "No other game running"
                : "No game running"}
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
        <ul className="flex flex-col gap-4">
          {games.map((game) => (
            <li key={game.id}>
              <Link
                href={`/play/${game.id}`}
                transitionTypes={NAV_FORWARD}
                className="block rounded-2xl transition-transform active:scale-[0.98]"
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl break-words">
                      {game.title}
                    </CardTitle>
                    {game.isPrivate && (
                      <CardAction
                        aria-label="Private game"
                        className="row-span-1 self-center"
                      >
                        <LockIcon strokeWidth={3} className="size-6" />
                      </CardAction>
                    )}
                  </CardHeader>
                  <CardContent className="flex flex-wrap gap-x-5 gap-y-2 text-muted-foreground">
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
                  </CardContent>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
