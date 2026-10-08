import type { Metadata } from "next";
import { Fredoka } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { cn } from "@/lib/utils";

const fredoka = Fredoka({
  variable: "--font-sans",
  subsets: ["latin"],
});

const luckiestGuy = localFont({
  src: "./fonts/LuckiestGuy-Regular.ttf",
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
  description: "Bingo grids for team building events",
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
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
