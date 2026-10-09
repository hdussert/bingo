import { cn } from "@/lib/utils";

// Gold, silver and bronze for the first three bingos
const PODIUM_COLORS = ["text-highlight", "text-zinc-300", "text-orange-400"];

type Props = {
  /** The position on the leaderboard, from 1. */
  position: number;
  /** The player's bingo rank, or `null` without a bingo. */
  bingoRank: number | null;
  className?: string;
};

/** A leaderboard position, colored like a medal for the first three bingos. */
export default function RankNumber({ position, bingoRank, className }: Props) {
  const color = bingoRank === null ? undefined : PODIUM_COLORS[bingoRank - 1];
  return (
    <span className={cn("font-heading", color, className)}>{position}</span>
  );
}
