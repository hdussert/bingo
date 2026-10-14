import CenteredPageLayout from "@/components/game/CenteredPageLayout";
import PageHeader from "@/components/game/PageHeader";
import BrokenLink from "@/components/game/BrokenLink";
import GameReady from "@/components/game/GameReady";
import { findPlayableGame } from "@/lib/game/access";
import { absoluteUrl } from "@/lib/url";

export default async function SharePage({ params }: PageProps<"/share/[id]">) {
  const { id } = await params;
  const href = `/play/${id}`;
  const [playable, url] = await Promise.all([
    findPlayableGame(id),
    absoluteUrl(href),
  ]);
  if (!playable) {
    return <BrokenLink />;
  }

  return (
    <CenteredPageLayout
      header={
        // Home, not the filled-in form: the game is already saved
        <PageHeader back="/" />
      }
    >
      <GameReady href={href} url={url} />
    </CenteredPageLayout>
  );
}
