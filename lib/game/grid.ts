import type { Game, GridCell, Player } from "./types";

/** Identifies a player within a game: the same name, ignoring case and surrounding spaces, is the same player. */
export function toNameKey(name: string): string {
  return name.trim().toLowerCase();
}

/** The game's player with this name (or name key), if they joined. */
export function findPlayer(players: Player[], name: string) {
  const nameKey = toNameKey(name);
  return players.find((player) => player.nameKey === nameKey);
}

/** Picks and shuffles a new player's cells, row by row, all unticked. */
export function buildGrid(game: Game): GridCell[] {
  const events = [...game.events];
  for (let i = events.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [events[i], events[j]] = [events[j], events[i]];
  }
  return events
    .slice(0, game.size ** 2)
    .map((event) => ({ eventId: event.id, isTicked: false }));
}
