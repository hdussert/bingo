/** Grid sizes the organizer can pick (cells per side). */
export const GRID_SIZES = [3, 4, 5] as const;

/** Tailwind classes laying out a grid of each size. */
export const GRID_COLUMNS = {
  3: "grid-cols-3",
  4: "grid-cols-4",
  5: "grid-cols-5",
} as const;

/** Tailwind text sizes that fit a cell of each grid size on a phone. */
export const GRID_TEXT_SIZES = {
  3: "text-sm sm:text-base",
  4: "text-xs sm:text-sm",
  5: "text-[10px] sm:text-xs",
} as const;

export const DEFAULT_GRID_SIZE = 4;

export const MAX_TITLE_LENGTH = 60;

export const MAX_EVENT_LENGTH = 60;

export const MAX_EVENTS = 50;

export const MAX_NAME_LENGTH = 30;

export const MIN_PASSWORD_LENGTH = 3;

export const MAX_PASSWORD_LENGTH = 30;

/** A game with no activity (created, joined or ticked) for this long is no longer listed as running. */
export const RUNNING_GAME_HOURS = 24;

/** Tappable ideas for a game's events, typical of a team building. */
export const EVENT_SUGGESTIONS = [
  "Someone arrives late",
  "A speech runs too long",
  "Group selfie",
  "The Wi-Fi drops",
  "Someone spills a drink",
  "Someone says “synergy”",
  "Karaoke happens",
  "The boss dances",
  "Someone talks about AI",
  "The food runs out",
  "Someone falls asleep",
  "A new inside joke is born",
];
