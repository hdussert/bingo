import BackLink from "@/components/game/BackLink";
import PageTitle from "@/components/game/PageTitle";
import RecoverForm from "@/components/profile/RecoverForm";
import { findCurrentProfile } from "@/lib/profile/session";

/** Gets a player's games back on another phone, from their code. */
export default async function RecoverPage() {
  const profile = await findCurrentProfile();

  return (
    <main className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-6 px-4 py-8">
      <div className="flex flex-col items-start gap-2">
        <BackLink href="/games" />
        <PageTitle>Get your games</PageTitle>
      </div>
      <RecoverForm currentName={profile?.name ?? null} />
    </main>
  );
}
