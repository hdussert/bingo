/** Another player's grid, read-only. */
export function peekHref(gameId: string, profileId: string) {
  return `/peek/${gameId}/${profileId}`;
}

/** Where a back link returns: the game the player came from, if any, or the games. Only a game page, so the link can't lead anywhere else. */
export function backHref(back: unknown) {
  return typeof back === "string" && /^\/play\/[\w-]+$/.test(back)
    ? back
    : "/games";
}

/** A page that comes back to this game with its back link. */
export function withBackToGame(href: string, gameId: string) {
  return `${href}?${new URLSearchParams({ back: `/play/${gameId}` })}`;
}
