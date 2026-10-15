import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { COLORS } from "@/lib/game/shareImage";

// Twice the tab's 32px, sharp on high-density screens
export const size = { width: 64, height: 64 };
export const contentType = "image/png";

/** The tab icon: the home page logo's B, white on a pink extrusion, on a party purple tile. */
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
        borderRadius: s * 0.22,
        backgroundColor: COLORS.background,
        fontFamily: "Luckiest Guy",
        fontSize: s * 0.74,
      }}
    >
      {/* Luckiest Guy sits high in its line: nudged down and left, so the letter and its extrusion look centered */}
      <div
        style={{
          display: "flex",
          position: "relative",
          marginTop: s * 0.12,
          marginLeft: -s * 0.04,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: s * 0.05,
            left: s * 0.04,
            color: COLORS.primary,
            WebkitTextStroke: `${s * 0.09}px ${COLORS.primary}`,
          }}
        >
          B
        </div>
        <div style={{ color: COLORS.foreground }}>B</div>
      </div>
    </div>,
    {
      ...size,
      fonts: [{ name: "Luckiest Guy", data: font, weight: 400 }],
    },
  );
}
