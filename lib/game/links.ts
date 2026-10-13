/** Another player's grid, read-only. */
export function peekHref(gameId: string, playerKey: string) {
  return `/peek/${gameId}/${encodeURIComponent(playerKey)}`;
}
