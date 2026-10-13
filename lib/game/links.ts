/** Another player's grid, read-only. */
export function peekHref(gameId: string, profileId: string) {
  return `/peek/${gameId}/${profileId}`;
}
