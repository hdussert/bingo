import type { Game, GridCell, Player } from "./types";

/** The game's player with this profile, if they joined. */
export function findPlayer(players: Player[], profileId: string | undefined) {
  return players.find((player) => player.profileId === profileId);
}

/** Picks and shuffles a new player's cells, row by row, all unticked. */
export function buildGrid(game: Pick<Game, "size" | "events">): GridCell[] {
  const events = [...game.events];
  for (let i = events.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [events[i], events[j]] = [events[j], events[i]];
  }
  return events
    .slice(0, game.size ** 2)
    .map((event) => ({ eventId: event.id, isTicked: false }));
}
