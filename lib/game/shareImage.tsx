import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import type { GridSize } from "./types";

/** The size chat apps and social networks expect for a link's preview image. */
export const SHARE_IMAGE_SIZE = { width: 1200, height: 630 };

// The image renderer reads TrueType, not the woff2 the pages use
const [luckiestGuy, fredoka] = await Promise.all([
  readFile(join(process.cwd(), "app/fonts/LuckiestGuy-Latin.ttf")),
  readFile(join(process.cwd(), "app/fonts/Fredoka-600-Latin.ttf")),
]);

// The theme's colors (app/globals.css) in hex: the renderer doesn't read oklch
const COLORS = {
  background: "#471e86",
  card: "#5f38a7",
  primary: "#f43096",
  highlight: "#fdd506",
  foreground: "#fbfbfb",
  muted: "rgba(255, 255, 255, 0.75)",
  border: "rgba(255, 255, 255, 0.22)",
};

// The home page's text-7xl
const LOGO_SIZE = 72;

// Offsets of the pink copies stacked under the logo, as deep as the home page's extrusion
const LOGO_DEPTHS = Array.from({ length: 11 }, (_, i) => LOGO_SIZE * 0.015 * i);

const GRID_WIDTH = 380;
const GRID_GAP = 12;

type Props = {
  title: string;
  subtitle: string;
  /** Facts about the game, shown on the last line. */
  details?: string[];
  /** Cells per side of the grid drawn on the right. */
  size: GridSize;
};

/** The preview image of a link to the app: a title, a line under it and a bingo grid with a line ticked, in the app's colors. */
export function shareImage({ title, subtitle, details = [], size }: Props) {
  const tile = (GRID_WIDTH - GRID_GAP * (size - 1)) / size;
  // A bingo on the diagonal, and a couple of cells ticked on the way
  const line = new Set(Array.from({ length: size }, (_, i) => i * (size + 1)));
  const ticked = new Set([1, size * 2 - 1]);

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 72,
        width: "100%",
        height: "100%",
        padding: 80,
        backgroundColor: COLORS.background,
        backgroundImage: `radial-gradient(circle at 85% 40%, ${COLORS.card} 0%, ${COLORS.background} 55%)`,
        color: COLORS.foreground,
        fontFamily: "Fredoka",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          height: "100%",
          justifyContent: "space-between",
        }}
      >
        {/* The home page's `text-cartoon` logo. The renderer can't draw a stroke under the fill nor
            shadow it, so outlined pink copies stack into the extrusion under the white letters */}
        <div
          style={{
            display: "flex",
            position: "relative",
            fontFamily: "Luckiest Guy",
            fontSize: LOGO_SIZE,
          }}
        >
          {LOGO_DEPTHS.map((depth) => (
            <div
              key={depth}
              style={{
                position: "absolute",
                top: depth,
                left: depth,
                color: COLORS.primary,
                WebkitTextStroke: `${LOGO_SIZE * 0.12}px ${COLORS.primary}`,
              }}
            >
              Bingo!
            </div>
          ))}
          <div style={{ color: COLORS.foreground }}>Bingo!</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontFamily: "Luckiest Guy",
              // Smaller as titles get longer, so the longest still fit
              fontSize: title.length > 40 ? 56 : title.length > 20 ? 72 : 92,
              lineHeight: 1.05,
            }}
          >
            {title}
          </div>
          <div style={{ fontSize: 34, color: COLORS.muted }}>{subtitle}</div>
        </div>
        <div style={{ display: "flex", fontSize: 30, color: COLORS.muted }}>
          {details.join("  ·  ")}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: GRID_GAP,
          width: GRID_WIDTH,
          transform: "rotate(6deg)",
        }}
      >
        {Array.from({ length: size * size }, (_, i) => {
          const isLine = line.has(i);
          const isTicked = isLine || ticked.has(i);
          return (
            <div
              key={i}
              style={{
                width: tile,
                height: tile,
                borderRadius: tile * 0.22,
                backgroundColor: isLine
                  ? COLORS.highlight
                  : isTicked
                    ? COLORS.primary
                    : COLORS.card,
                // Raised like the app's cells, pressed flat once ticked
                boxShadow: isTicked ? "none" : `0 8px 0 ${COLORS.border}`,
                marginTop: isTicked ? 8 : 0,
                marginBottom: isTicked ? 0 : 8,
              }}
            />
          );
        })}
      </div>
    </div>,
    {
      ...SHARE_IMAGE_SIZE,
      fonts: [
        { name: "Luckiest Guy", data: luckiestGuy, weight: 400 },
        { name: "Fredoka", data: fredoka, weight: 600 },
      ],
    },
  );
}
