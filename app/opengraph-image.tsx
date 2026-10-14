import { DEFAULT_GRID_SIZE } from "@/lib/game/const";
import { shareImage, SHARE_IMAGE_SIZE } from "@/lib/game/shareImage";

export const alt = "Bingo: play with your friends";
export const size = SHARE_IMAGE_SIZE;
export const contentType = "image/png";

/** The preview image of a link to any page without its own. */
export default function Image() {
  return shareImage({
    title: "Bingo with friends",
    subtitle: "Guess what will happen, then tick it off when it does.",
    size: DEFAULT_GRID_SIZE,
  });
}
