import type { Game, GridCell } from "./types";

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
