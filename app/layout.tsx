import type { Metadata } from "next";
import { Fredoka, Luckiest_Guy } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const fredoka = Fredoka({
  variable: "--font-sans",
  subsets: ["latin"],
});

const luckiestGuy = Luckiest_Guy({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: "400",
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
