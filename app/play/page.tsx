import { Link2OffIcon } from "lucide-react";
import Link from "next/link";
import BingoGrid from "@/components/game/BingoGrid";
import JoinForm from "@/components/game/JoinForm";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { decodeGame } from "@/lib/game/code";
import { buildGrid, gridId } from "@/lib/game/grid";

export default async function PlayPage({ searchParams }: PageProps<"/play">) {
  const { g, name } = await searchParams;
  const code = typeof g === "string" ? g : "";
  const game = decodeGame(code);
  const playerName = typeof name === "string" ? name.trim() : "";

  if (!game) {
    return (
      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col px-4 py-8">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Link2OffIcon />
            </EmptyMedia>
            <EmptyTitle>This game link is broken</EmptyTitle>
            <EmptyDescription>
              Ask the organizer for the link again, or create your own game.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button nativeButton={false} render={<Link href="/" />}>
              Create a game
            </Button>
          </EmptyContent>
        </Empty>
      </main>
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-lg flex-col gap-6 px-4 py-8">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="font-heading text-4xl break-words text-primary">
          {game.title}
        </h1>
        {playerName && (
          <p className="text-muted-foreground">
            Playing as{" "}
            <span className="font-semibold text-foreground">{playerName}</span>{" "}
            ·{" "}
            <Link
              href={`/play?g=${code}`}
              className="text-primary underline-offset-4 hover:underline"
            >
              Not you?
            </Link>
          </p>
        )}
      </div>
      {playerName ? (
        <BingoGrid
          cells={buildGrid(game, code, playerName)}
          size={game.size}
          storageKey={`bingo:${gridId(code, playerName)}`}
        />
      ) : (
        <JoinForm code={code} />
      )}
    </main>
  );
}
