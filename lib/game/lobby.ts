import { findBingoLines } from "./bingo";
import type { Player } from "./types";

export type LobbyRow = {
  name: string;
  tickCount: number;
  lineCount: number;
  /** 1 for the first player to reach a bingo, 2 for the second…, or `null` without a bingo. */
  bingoRank: number | null;
};

/** Ranks the players: bingos first in the order they got them, then by most lines, then most ticks. */
export function rankPlayers(players: Player[], size: number): LobbyRow[] {
  const rows = players.map((player) => {
    const ticked = player.grid.map((cell) => cell.isTicked);
    return {
      name: player.name,
      tickCount: ticked.filter(Boolean).length,
      lineCount: findBingoLines(ticked, size).length,
      bingoTime: player.bingoAt?.getTime() ?? Infinity,
    };
  });
  rows.sort(
    (a, b) =>
      a.bingoTime - b.bingoTime ||
      b.lineCount - a.lineCount ||
      b.tickCount - a.tickCount,
  );
  return rows.map(({ bingoTime, ...row }, i) => ({
    ...row,
    bingoRank: bingoTime === Infinity ? null : i + 1,
  }));
}
