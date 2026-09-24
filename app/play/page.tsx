import Link from "next/link";
import BingoGrid from "@/components/game/BingoGrid";
import JoinForm from "@/components/game/JoinForm";
import { decodeGame } from "@/lib/game/code";
import { buildGrid, gridId } from "@/lib/game/grid";

export default async function PlayPage({ searchParams }: PageProps<"/play">) {
  const { g, name } = await searchParams;
  const code = typeof g === "string" ? g : "";
  const game = decodeGame(code);
  const playerName = typeof name === "string" ? name.trim() : "";

  if (!game) {
    return (
      <main className="mx-auto flex w-full max-w-lg flex-col gap-4 px-4 py-8">
        <h1 className="text-2xl font-bold">This game link is broken</h1>
        <p className="text-zinc-500">
          Ask the organizer for the link again, or create your own game.
        </p>
        <Link href="/" className="font-semibold text-violet-600">
          Create a game
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-lg flex-col gap-6 px-4 py-8">
      <div>
        <h1 className="text-2xl font-black tracking-tight break-words">
          {game.title}
        </h1>
        {playerName && (
          <p className="text-zinc-500">
            Playing as <span className="font-semibold">{playerName}</span> ·{" "}
            <Link href={`/play?g=${code}`} className="text-violet-600">
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
