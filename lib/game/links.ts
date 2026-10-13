/** The game page as `name` sees it. */
export function playHref(gameId: string, name: string) {
  return `/play/${gameId}?${new URLSearchParams({ name })}`;
}

/** Another player's grid, read-only, as `name` sees it. */
export function peekHref(gameId: string, name: string, playerKey: string) {
  return `/peek/${gameId}/${encodeURIComponent(playerKey)}?${new URLSearchParams({ name })}`;
}
