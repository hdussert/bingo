import { redirect } from "next/navigation";
import EndGameForm from "@/components/game/EndGameForm";
import GamePlayersCard from "@/components/game/GamePlayersCard";
import GameSettingsForm from "@/components/game/GameSettingsForm";
import PageLayout from "@/components/game/PageLayout";
import PageHeader from "@/components/game/PageHeader";
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
    <PageLayout
      header={<PageHeader back={`/play/${id}`} />}
      title="Manage game"
      subtitle="Only you can see this page: you created the game."
      // Room at the bottom for the Save bar, so it never covers the last button
      className="pb-32"
    >
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
    </PageLayout>
  );
}
