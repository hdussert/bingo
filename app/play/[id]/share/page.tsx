import { headers } from "next/headers";
import BackLink from "@/components/game/BackLink";
import BrokenLink from "@/components/game/BrokenLink";
import GameReady from "@/components/game/GameReady";
import { findPlayableGame } from "@/lib/game/access";

export default async function SharePage({
  params,
}: PageProps<"/play/[id]/share">) {
  const { id } = await params;
  const [playable, requestHeaders] = await Promise.all([
    findPlayableGame(id),
    headers(),
  ]);
  if (!playable) {
    return <BrokenLink />;
  }
  const href = `/play/${id}`;
  const protocol = requestHeaders.get("x-forwarded-proto") ?? "http";
  const url = `${protocol}://${requestHeaders.get("host")}${href}`;

  return (
    <main className="mx-auto flex w-full max-w-lg flex-col gap-6 px-4 py-8">
      {/* Home, not the filled-in form: the game is already saved */}
      <BackLink href="/" />
      <GameReady href={href} url={url} />
    </main>
  );
}
