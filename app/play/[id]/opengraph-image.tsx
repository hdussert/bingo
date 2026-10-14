import { DEFAULT_GRID_SIZE } from "@/lib/game/const";
import { findGameWithPassword, listPlayers } from "@/lib/game/games";
import { shareImage, SHARE_IMAGE_SIZE } from "@/lib/game/shareImage";

export const alt = "An invitation to a bingo game";
export const size = SHARE_IMAGE_SIZE;
export const contentType = "image/png";

/** The preview image of a game's link: its title, who invites, and what to expect. */
export default async function Image({ params }: PageProps<"/play/[id]">) {
  const { id } = await params;
  const [stored, players] = await Promise.all([
    findGameWithPassword(id),
    listPlayers(id),
  ]);
  if (!stored) {
    return shareImage({
      title: "Bingo with friends",
      subtitle: "This game is gone, but you can start your own.",
      size: DEFAULT_GRID_SIZE,
    });
  }
  const { game, passwordHash } = stored;
  const playerCount = players.length;
  return shareImage({
    title: game.title,
    subtitle: game.creator
      ? `${game.creator.name} invites you to play`
      : "You're invited to play",
    details: [
      `${game.size}×${game.size} grid`,
      `${playerCount} ${playerCount === 1 ? "player" : "players"}`,
      ...(passwordHash !== null ? ["Private"] : []),
      ...(game.isEnded ? ["Game over"] : []),
    ],
    size: game.size,
  });
}
