import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { IMAGE_COLORS } from "@/lib/game/const";

/** 64px: a tab shows it at 16 CSS px, so it stays sharp up to 4× screens. */
export const size = { width: 64, height: 64 };

/** The generated icon's format. */
export const contentType = "image/png";

/** The tab icon: a white B in the logo's font on a pink tile. */
export default async function Icon() {
  const font = await readFile(
    join(process.cwd(), "app/fonts/LuckiestGuy-Latin.ttf"),
  );
  const s = size.width;

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        // Luckiest Guy sits high in its line: pushed down so the letter looks centered
        paddingTop: s * 0.17,
        borderRadius: s * 0.22,
        backgroundColor: IMAGE_COLORS.primary,
        color: IMAGE_COLORS.foreground,
        fontFamily: "Luckiest Guy",
        fontSize: s * 0.78,
      }}
    >
      B
    </div>,
    {
      ...size,
      fonts: [{ name: "Luckiest Guy", data: font, weight: 400 }],
    },
  );
}
