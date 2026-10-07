import { Grid3x3Icon } from "lucide-react";
import Link from "next/link";
import { connection } from "next/server";
import BackLink from "@/components/game/BackLink";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from "@/components/ui/item";
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
        <ItemGroup className="gap-2">
          {games.map((game) => (
            <Item
              key={game.id}
              variant="outline"
              render={
                <Link href={`/play/${game.id}`} transitionTypes={NAV_FORWARD} />
              }
            >
              <ItemContent>
                <ItemTitle>{game.title}</ItemTitle>
                <ItemDescription>
                  {game.size}×{game.size} ·{" "}
                  {game.playerCount === 1
                    ? "1 player"
                    : `${game.playerCount} players`}{" "}
                  · active {formatTimeAgo(game.lastActivityAt)}
                </ItemDescription>
              </ItemContent>
            </Item>
          ))}
        </ItemGroup>
      )}
    </main>
  );
}
