import PageHeader from "@/components/game/PageHeader";
import NewGameForm from "@/components/game/NewGameForm";
import PageTitle from "@/components/game/PageTitle";
import { findCurrentProfile } from "@/lib/profile/session";

export default async function NewGamePage() {
  const profile = await findCurrentProfile();

  return (
    <main className="mx-auto flex w-full max-w-lg flex-col gap-6 px-4 py-8">
      <div className="flex flex-col items-start gap-2">
        <PageHeader back="/" />
        <PageTitle>New game</PageTitle>
        <p className="text-muted-foreground">
          List what might happen, pick a grid size, and share the link.
        </p>
      </div>
      <NewGameForm needsName={!profile} />
    </main>
  );
}
