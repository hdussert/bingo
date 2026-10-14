import PageLayout from "@/components/game/PageLayout";
import PageHeader from "@/components/game/PageHeader";
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
    <PageLayout
      header={<PageHeader back={backTo} />}
      title="Get your games"
      subtitle="Pick up your games on this phone."
    >
      <RecoverForm currentName={profile?.name ?? null} back={backTo} />
    </PageLayout>
  );
}
