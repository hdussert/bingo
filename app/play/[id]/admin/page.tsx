import { redirect } from "next/navigation";
import EndGameForm from "@/components/game/EndGameForm";
import GamePlayersCard from "@/components/game/GamePlayersCard";
import GameSettingsForm from "@/components/game/GameSettingsForm";
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
  if (!organized) {
    redirect(`/play/${id}`);
  }
  const { game, isPrivate, organizerId } = organized;

  return (
    // Room at the bottom for the Save bar, so it never covers the last button
    <main className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-8 px-4 pt-8 pb-32">
      <div className="flex flex-col items-start gap-2">
        <PageHeader back={`/play/${id}`} />
        <PageTitle>Manage game</PageTitle>
        <p className="text-muted-foreground">
          Only you see this page, as the organizer.
        </p>
      </div>
      <div className="flex flex-col gap-8">
        <GameSettingsForm
          gameId={game.id}
          title={game.title}
          isPrivate={isPrivate}
        />
        <GamePlayersCard
          gameId={game.id}
          organizerId={organizerId}
          players={players}
        />
        <EndGameForm gameId={game.id} isEnded={game.isEnded} />
      </div>
    </main>
  );
}
