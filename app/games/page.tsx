import { ClockIcon, Grid3x3Icon, UsersIcon } from "lucide-react";
import Link from "next/link";
import { connection } from "next/server";
import BackLink from "@/components/game/BackLink";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

const timeAgo = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

function formatTimeAgo(date: Date): string {
  const minutes = Math.round((date.getTime() - Date.now()) / 60_000);
  if (minutes > -60) {
    return timeAgo.format(minutes, "minute");
  }
  return timeAgo.format(Math.round(minutes / 60), "hour");
}

export default async function GamesPage() {
  // Read the games on every visit, not once at build time
  await connection();
  const games = await listRunningGames();

  return (
    <main className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-6 px-4 py-8">
      <div className="flex flex-col items-start gap-2">
        <BackLink href="/" />
        <h1 className="font-heading text-4xl text-primary">Join a game</h1>
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
            <Button
              nativeButton={false}
              render={<Link href="/new" transitionTypes={NAV_FORWARD} />}
            >
              Create a game
            </Button>
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
                  </CardHeader>
                  <CardContent className="flex flex-wrap gap-x-5 gap-y-2 text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Grid3x3Icon className="size-4" />
                      {game.size}×{game.size}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <UsersIcon className="size-4" />
                      {game.playerCount === 1
                        ? "1 player"
                        : `${game.playerCount} players`}
                    </span>
                    <span className="flex items-center gap-1.5">
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
