const timeAgo = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

/** Formats a count with its word: "1 player", "3 players". */
export function pluralize(count: number, word: string): string {
  return `${count} ${count === 1 ? word : `${word}s`}`;
}

/** Formats how long ago a date was: "just now", "5 minutes ago", "2 hours ago". */
export function formatTimeAgo(date: Date): string {
  const minutes = Math.round((date.getTime() - Date.now()) / 60_000);
  // Also covers a date slightly in the future, when the database clock is ahead
  if (minutes > -1) {
    return "just now";
  }
  if (minutes > -60) {
    return timeAgo.format(minutes, "minute");
  }
  return timeAgo.format(Math.round(minutes / 60), "hour");
}
