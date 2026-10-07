import Link from "next/link";
import BingoGrid from "@/components/game/BingoGrid";
import BrokenLink from "@/components/game/BrokenLink";
import JoinForm from "@/components/game/JoinForm";
import { findGame, findPlayer } from "@/lib/game/games";

export default async function PlayPage({
  params,
  searchParams,
}: PageProps<"/play/[id]">) {
  const { id } = await params;
  const { name } = await searchParams;
  const playerName = typeof name === "string" ? name.trim() : "";

  const game = await findGame(id);
  if (!game) {
    return <BrokenLink />;
  }
  const player = playerName ? await findPlayer(game.id, playerName) : null;
  const eventTexts = new Map(
    game.events.map((event) => [event.id, event.text]),
  );

  return (
    <main className="mx-auto flex w-full max-w-lg flex-col gap-6 px-4 py-8">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="font-heading text-4xl break-words text-primary">
          {game.title}
        </h1>
        {player && (
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
        <BingoGrid
          gameId={game.id}
          playerName={player.name}
          size={game.size}
          cells={player.grid.map((cell) => ({
            text: eventTexts.get(cell.eventId) ?? "",
            isTicked: cell.isTicked,
          }))}
        />
      ) : (
        <JoinForm gameId={game.id} defaultName={playerName} />
      )}
    </main>
  );
}
