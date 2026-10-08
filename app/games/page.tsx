import { ClockIcon, Grid3x3Icon, LockIcon, UsersIcon } from "lucide-react";
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
import { listRunningGames } from "@/lib/game/games";
import { NAV_FORWARD } from "@/lib/transitions";
import ButtonLink from "@/components/game/ButtonLink";
import PageTitle from "@/components/game/PageTitle";
import { formatTimeAgo, pluralize } from "@/lib/game/format";

export default async function GamesPage() {
  // Read the games on every visit, not once at build time
  await connection();
  const games = await listRunningGames();

  return (
    <main className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-6 px-4 py-8">
      <div className="flex flex-col items-start gap-2">
        <BackLink href="/" />
        <div className="flex w-full items-center justify-between gap-4">
          <PageTitle>Join a game</PageTitle>
          <RefreshButton />
        </div>
      </div>
      {games.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Grid3x3Icon />
            </EmptyMedia>
            <EmptyTitle>No game running</EmptyTitle>
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
                        <LockIcon className="size-6" />
                      </CardAction>
                    )}
                  </CardHeader>
                  <CardContent className="grid grid-cols-3 gap-2 text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Grid3x3Icon className="size-4 shrink-0" />
                      {game.size}×{game.size}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <UsersIcon className="size-4 shrink-0" />
                      {pluralize(game.playerCount, "player")}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <ClockIcon className="size-4 shrink-0" />
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
