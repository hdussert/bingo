import PageHeader from "@/components/game/PageHeader";
import PageTitle from "@/components/game/PageTitle";
import RecoverForm from "@/components/profile/RecoverForm";
import { backHref } from "@/lib/game/links";
import { findCurrentProfile } from "@/lib/profile/session";

/** Gets a player's games back on another phone, from their code. */
export default async function RecoverPage({
  searchParams,
}: PageProps<"/recover">) {
  const { back } = await searchParams;
  const profile = await findCurrentProfile();
  const backTo = backHref(back);

  return (
    <main className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-8 px-4 py-8">
      <div className="flex flex-col items-start gap-2">
        <PageHeader back={backTo} />
        <PageTitle>Get your games</PageTitle>
        <p className="text-muted-foreground">Pick up your games on this phone.</p>
      </div>
      <RecoverForm currentName={profile?.name ?? null} back={backTo} />
    </main>
  );
}
