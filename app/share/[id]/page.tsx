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
    <main className="relative mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-4 py-8">
      {/* Out of the flow, where it sits on other pages, so the content centers on the whole screen */}
      <div className="absolute top-8 left-4">
        {/* Home, not the filled-in form: the game is already saved */}
        <BackLink href="/" />
      </div>
      <GameReady href={href} url={url} />
    </main>
  );
}
