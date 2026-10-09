/** The game page as `name` sees it, peeking at the grid of the player with `peekKey` if given. */
export function playHref(gameId: string, name: string, peekKey?: string) {
  const params = new URLSearchParams({ name });
  if (peekKey) {
    params.set("peek", peekKey);
  }
  return `/play/${gameId}?${params}`;
}
