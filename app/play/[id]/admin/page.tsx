import { redirect } from "next/navigation";
import EndGameForm from "@/components/game/EndGameForm";
import GameAccessForm from "@/components/game/GameAccessForm";
import GamePlayersCard from "@/components/game/GamePlayersCard";
import GameTitleForm from "@/components/game/GameTitleForm";
import PageHeader from "@/components/game/PageHeader";
import PageTitle from "@/components/game/PageTitle";
import { findOrganizedGame } from "@/lib/game/access";
import { listPlayers } from "@/lib/game/games";

/** The organizer's settings for their game: its title, who can join, its players, and ending it. */
export default async function AdminPage({
  params,
}: PageProps<"/play/[id]/admin">) {
  const { id } = await params;
  const [organized, players] = await Promise.all([
    findOrganizedGame(id),
    listPlayers(id),
  ]);
  // Only for the organizer: everyone else gets the game itself
  if (!organized?.game.creator) {
    redirect(`/play/${id}`);
  }
  const organizerId = organized.game.creator.id;
  const { game, isPrivate } = organized;

  return (
    <main className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-6 px-4 py-8">
      <div className="flex flex-col items-start gap-2">
        <PageHeader back={`/play/${id}`} />
        <PageTitle>Manage game</PageTitle>
      </div>
      <GameTitleForm gameId={game.id} title={game.title} />
      <GameAccessForm gameId={game.id} isPrivate={isPrivate} />
      <GamePlayersCard
        gameId={game.id}
        organizerId={organizerId}
        players={players}
      />
      <EndGameForm gameId={game.id} isEnded={game.endedAt !== null} />
    </main>
  );
}
