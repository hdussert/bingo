import { redirect } from "next/navigation";
import EndGameForm from "@/components/game/EndGameForm";
import GameTitleForm from "@/components/game/GameTitleForm";
import PageHeader from "@/components/game/PageHeader";
import PageTitle from "@/components/game/PageTitle";
import { findOrganizedGame } from "@/lib/game/access";

/** The organizer's settings for their game: its title, and ending it. */
export default async function AdminPage({
  params,
}: PageProps<"/play/[id]/admin">) {
  const { id } = await params;
  const game = await findOrganizedGame(id);
  // Only for the organizer: everyone else gets the game itself
  if (!game) {
    redirect(`/play/${id}`);
  }

  return (
    <main className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-6 px-4 py-8">
      <div className="flex flex-col items-start gap-2">
        <PageHeader back={`/play/${id}`} />
        <PageTitle>Manage game</PageTitle>
      </div>
      <GameTitleForm gameId={game.id} title={game.title} />
      <EndGameForm gameId={game.id} isEnded={game.endedAt !== null} />
    </main>
  );
}
