import { cn } from "@/lib/utils";

// Gold, silver and bronze for the first three bingos
const PODIUM_COLORS = [
  "text-metal-gold",
  "text-metal-silver",
  "text-metal-bronze",
];

type Props = {
  /** The position on the leaderboard, from 1. */
  position: number;
  /** The player's bingo rank, or `null` without a bingo. */
  bingoRank: number | null;
  className?: string;
};

/** A leaderboard position, in gold, silver or bronze metal for the first three bingos. */
export default function RankNumber({ position, bingoRank, className }: Props) {
  const color = bingoRank === null ? undefined : PODIUM_COLORS[bingoRank - 1];
  return (
    <span className={cn("font-heading", color, className)}>{position}</span>
  );
}
