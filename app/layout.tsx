import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Toasts from "@/components/game/Toasts";
import { cn } from "@/lib/utils";

const fredoka = localFont({
  src: [
    { path: "./fonts/Fredoka-400-Latin.woff2", weight: "400" },
    { path: "./fonts/Fredoka-500-Latin.woff2", weight: "500" },
    { path: "./fonts/Fredoka-600-Latin.woff2", weight: "600" },
  ],
  variable: "--font-sans",
  // Its letters sit low in the line box (lowercase 0.13em below center): moving descent space
  // above centers the middle of the lowercase and capital heights in inputs and buttons
  declarations: [
    { prop: "ascent-override", value: "90%" },
    { prop: "descent-override", value: "31%" },
  ],
});

const luckiestGuy = localFont({
  src: "./fonts/LuckiestGuy-Latin.woff2",
  variable: "--font-heading",
  // The font reserves 30% of its height below the baseline for descenders, but its letters are
  // all capitals 71% tall: moving that space above centers them in any box
  declarations: [
    { prop: "ascent-override", value: "85.5%" },
    { prop: "descent-override", value: "14.5%" },
  ],
});

export const metadata: Metadata = {
  title: "Bingo",
  description:
    "Play bingo with your friends: guess what will happen, then tick it off when it does.",
  // Pages' title and description fill in the rest of the link preview
  openGraph: { siteName: "Bingo" },
  // The preview image in full, not a thumbnail
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn(
        "dark h-full antialiased",
        fredoka.variable,
        luckiestGuy.variable,
      )}
    >
      <body className="flex min-h-full flex-col">
        {children}
        <Toasts />
      </body>
    </html>
  );
}
