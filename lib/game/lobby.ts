import { findGridLines } from "./bingo";
import type { Player } from "./types";

const MEDALS = ["🥇", "🥈", "🥉"];

/** A player's progress, as shown in the lobby. */
export type LobbyRow = {
  name: string;
  nameKey: string;
  tickCount: number;
  cellCount: number;
  lineCount: number;
  /** 1 for the first player to reach a bingo, 2 for the second…, or `null` without a bingo. */
  bingoRank: number | null;
};

/** Ranks the players: bingos first in the order they got them, then by most lines, then most ticks. */
export function rankPlayers(players: Player[]): LobbyRow[] {
  const rows = players.map((player) => ({
    name: player.name,
    nameKey: player.nameKey,
    tickCount: player.grid.filter((cell) => cell.isTicked).length,
    cellCount: player.grid.length,
    lineCount: findGridLines(player.grid).length,
    bingoTime: player.bingoAt?.getTime() ?? Infinity,
  }));
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

/** A medal for the first three bingos, the position (from 1) for everyone else. */
export function rankLabel(row: LobbyRow, position: number): string | number {
  const medal = row.bingoRank === null ? undefined : MEDALS[row.bingoRank - 1];
  return medal ?? position;
}
