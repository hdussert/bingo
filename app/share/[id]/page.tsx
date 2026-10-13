import BackLink from "@/components/game/BackLink";
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
    // Equal rows above and below center the content on the whole screen; on a short screen they shrink to the back arrow instead of overlapping it
    <main className="mx-auto grid w-full max-w-lg flex-1 grid-rows-[1fr_auto_1fr] gap-6 px-4 py-8">
      <div className="self-start">
        {/* Home, not the filled-in form: the game is already saved */}
        <BackLink href="/" />
      </div>
      <GameReady href={href} url={url} />
    </main>
  );
}
