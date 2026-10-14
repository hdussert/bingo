import PageLayout from "@/components/game/PageLayout";
import PageHeader from "@/components/game/PageHeader";
import NewGameForm from "@/components/game/NewGameForm";
import { findCurrentProfile } from "@/lib/profile/session";

export default async function NewGamePage() {
  const profile = await findCurrentProfile();

  return (
    <PageLayout
      header={<PageHeader back="/" />}
      title="New game"
      subtitle="Guess what might happen, pick a grid, and invite your friends."
    >
      <NewGameForm needsName={!profile} />
    </PageLayout>
  );
}
