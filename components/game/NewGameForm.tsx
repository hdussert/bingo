"use client";

import Link from "next/link";
import { useState } from "react";
import { encodeGame, gameSchema } from "@/lib/game/code";
import {
  DEFAULT_GRID_SIZE,
  GRID_SIZES,
  MAX_TITLE_LENGTH,
} from "@/lib/game/const";
import type { GridSize } from "@/lib/game/types";

const INPUT_CLASSES =
  "rounded-lg border border-zinc-300 bg-white px-3 py-2 text-base dark:border-zinc-700 dark:bg-zinc-900";

/** Returns the non-empty lines of `text`, trimmed and without duplicates (ignoring case). */
function parseEvents(text: string): string[] {
  const seen = new Set<string>();
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => {
      const key = line.toLowerCase();
      if (!line || seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
}

/** Lets the organizer set up a game and share its link. */
export default function NewGameForm() {
  const [title, setTitle] = useState("");
  const [size, setSize] = useState<GridSize>(DEFAULT_GRID_SIZE);
  const [eventsText, setEventsText] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  const events = parseEvents(eventsText);
  const required = size ** 2;
  const result = gameSchema.safeParse({ title, size, events });
  const href = result.success ? `/play?g=${encodeGame(result.data)}` : null;
  // The counter already shows missing events, and an empty title only hides the link
  const errors = result.success
    ? []
    : [
        ...new Set(
          result.error.issues
            .filter(
              (issue) =>
                issue.code !== "custom" &&
                !(issue.code === "too_small" && issue.path[0] === "title"),
            )
            .map((issue) => issue.message),
        ),
      ];

  async function copyLink() {
    if (!href) {
      return;
    }
    await navigator.clipboard.writeText(
      new URL(href, location.origin).toString(),
    );
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <label htmlFor="title" className="font-medium">
          Title
        </label>
        <input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={MAX_TITLE_LENGTH}
          placeholder="Team building bingo"
          className={INPUT_CLASSES}
        />
      </div>

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 font-medium">Grid size</legend>
        <div className="grid grid-cols-3 gap-2">
          {GRID_SIZES.map((option) => (
            <label
              key={option}
              className="cursor-pointer rounded-lg border border-zinc-300 py-2 text-center has-checked:border-violet-600 has-checked:bg-violet-600 has-checked:text-white dark:border-zinc-700"
            >
              <input
                type="radio"
                name="size"
                value={option}
                checked={size === option}
                onChange={() => setSize(option)}
                className="sr-only"
              />
              {option}×{option}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="flex flex-col gap-2">
        <div className="flex items-baseline justify-between">
          <label htmlFor="events" className="font-medium">
            Events, one per line
          </label>
          <span
            className={`text-sm ${events.length >= required ? "text-green-600" : "text-zinc-500"}`}
          >
            {events.length} / {required}
          </span>
        </div>
        <textarea
          id="events"
          value={eventsText}
          onChange={(e) => setEventsText(e.target.value)}
          rows={10}
          placeholder={"Greg says kudos\nBakari talks about AI\n…"}
          className={INPUT_CLASSES}
        />
        <p className="text-sm text-zinc-500">
          At least {required} events for a {size}×{size} grid. With more, each
          player gets a different selection.
        </p>
      </div>

      {errors.length > 0 && (
        <ul className="text-sm text-red-600">
          {errors.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      )}

      {href && (
        <div className="flex flex-col gap-2 rounded-lg border border-violet-600 p-4">
          <p className="font-medium">
            Your game is ready. Share its link with the players.
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={copyLink}
              className="rounded-lg bg-violet-600 px-4 py-2.5 font-semibold text-white hover:bg-violet-700"
            >
              {isCopied ? "Copied!" : "Copy link"}
            </button>
            <Link
              href={href}
              className="rounded-lg border border-violet-600 px-4 py-2.5 text-center font-semibold text-violet-600"
            >
              Open game
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
