import { DEFAULT_GRID_SIZE } from "@/lib/game/const";
import { findGameWithPassword } from "@/lib/game/games";
import { shareImage, SHARE_IMAGE_SIZE } from "@/lib/game/shareImage";

export const alt = "An invitation to a bingo game";
export const size = SHARE_IMAGE_SIZE;
export const contentType = "image/png";

/** The preview image of a game's link: its title, who invites, and what to expect. */
export default async function Image({ params }: PageProps<"/play/[id]">) {
  const { id } = await params;
  const stored = await findGameWithPassword(id);
  if (!stored) {
    return shareImage({
      title: "Bingo with friends",
      subtitle: "This game is gone, but you can start your own.",
      size: DEFAULT_GRID_SIZE,
    });
  }
  const { game, passwordHash } = stored;
  return shareImage({
    title: game.title,
    subtitle: game.creator
      ? `${game.creator.name} invites you to play`
      : "You're invited to play",
    details: [
      `${game.size}×${game.size} grid`,
      ...(passwordHash !== null ? ["Private"] : []),
      ...(game.isEnded ? ["Game over"] : []),
    ],
    size: game.size,
  });
}
