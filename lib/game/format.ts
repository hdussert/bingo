/** Formats a count with its word: "1 player", "3 players". */
export function pluralize(count: number, word: string): string {
  return `${count} ${count === 1 ? word : `${word}s`}`;
}
