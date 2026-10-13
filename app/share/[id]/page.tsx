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
    <main className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-6 px-4 py-8">
      {/* Home, not the filled-in form: the game is already saved */}
      <BackLink href="/" />
      {/* Centered in the space under the back arrow, like the home page */}
      <div className="my-auto">
        <GameReady href={href} url={url} />
      </div>
    </main>
  );
}
