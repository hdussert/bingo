"use client";

import { WandSparklesIcon, XIcon } from "lucide-react";
import { startTransition, useRef, useState, ViewTransition } from "react";
import EventSuggestions from "@/components/game/EventSuggestions";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { MAX_EVENT_LENGTH, MAX_EVENTS } from "@/lib/game/const";
import { parseEvents } from "@/lib/game/schemas";
import type { GridSize } from "@/lib/game/types";

type Props = {
  events: string[];
  size: GridSize;
  onChange: (events: string[]) => void;
};

// The progress bar counts the rest: a full 5×5 of empty tiles would only add scrolling
const MAX_EMPTY_TILES = 6;

/** Adds events one at a time as tiles, with empty tiles for some of the ones still needed. */
export default function EventsTileInput({ events, size, onChange }: Props) {
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const isFull = events.length >= MAX_EVENTS;
  const missingCount = Math.max(size ** 2 - events.length, 0);
  const emptyTileCount = Math.min(missingCount, MAX_EMPTY_TILES);

  // Pasted lists add one event per line; parseEvents drops blanks and duplicates, and anything past the limit is left out
  function add(text: string) {
    update(parseEvents([...events, text].join("\n")).slice(0, MAX_EVENTS));
  }

  function addDraft() {
    if (!draft.trim()) {
      return;
    }
    add(draft);
    setDraft("");
    inputRef.current?.focus();
  }

  // Inside a transition, so each tile's <ViewTransition> animates: new tiles pop in, removed ones shrink away, the rest slide into place
  function update(next: string[]) {
    startTransition(() => onChange(next));
  }

  // Development shortcut: test events until the grid is full, like pasting a list
  function fillGrid() {
    const fillers = Array.from(
      { length: missingCount },
      (_, i) => `Test event ${events.length + i + 1}`,
    );
    add(fillers.join("\n"));
  }

  // A half-typed event becomes a tile instead of being overwritten
  function edit(event: string) {
    const others = events.filter((other) => other !== event);
    update(parseEvents([...others, draft].join("\n")));
    setDraft(event);
    inputRef.current?.focus();
  }

  function remove(event: string) {
    update(events.filter((other) => other !== event));
  }

  return (
    <div className="flex flex-col gap-4">
      <InputGroup>
        <InputGroupInput
          ref={inputRef}
          aria-label="New event"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            // Enter adds the event instead of submitting the form
            if (e.key === "Enter") {
              e.preventDefault();
              addDraft();
            }
          }}
          onPaste={(e) => {
            const text = e.clipboardData.getData("text");
            if (text.includes("\n")) {
              e.preventDefault();
              add(text);
            }
          }}
          maxLength={MAX_EVENT_LENGTH}
          disabled={isFull}
          placeholder={isFull ? "That's the maximum" : "Greg says kudos"}
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            variant="default"
            size="sm"
            className="h-9 px-4"
            // Keeps focus in the input, so the phone keyboard stays open between events
            onPointerDown={(e) => e.preventDefault()}
            onClick={addDraft}
            disabled={isFull || !draft.trim()}
          >
            Add
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      {/* Three columns whatever the grid size: five are too narrow for words on a phone */}
      <ul className="grid grid-cols-3 gap-2">
        {/* Newest first, so the event just added shows next to the input */}
        {[...events].reverse().map((event) => (
          <ViewTransition
            key={`event-${event}`}
            enter="tile-in"
            exit="tile-out"
          >
            <li className="relative">
              <button
                type="button"
                onClick={() => edit(event)}
                className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-[22%] bg-primary p-2.5 text-center text-sm leading-tight font-medium text-primary-foreground"
              >
                <span className="line-clamp-5 break-words">{event}</span>
              </button>
              <button
                type="button"
                onClick={() => remove(event)}
                aria-label={`Remove “${event}”`}
                className="absolute top-1 right-1 flex size-5 items-center justify-center rounded-full bg-black/30 text-white"
              >
                <XIcon strokeWidth={3} className="size-3" />
              </button>
            </li>
          </ViewTransition>
        ))}
        {Array.from({ length: emptyTileCount }, (_, i) => (
          // Keyed by grid slot: the tile added into a slot replaces its placeholder in place, and the rest stay put while a new one grows at the end
          <ViewTransition
            key={`empty-${events.length + i}`}
            enter="tile-in"
            exit="none"
          >
            <li
              aria-hidden
              className="aspect-square rounded-[22%] border-2 border-dashed border-border"
            />
          </ViewTransition>
        ))}
      </ul>
      {/* Replaced at build time: production builds drop the button entirely */}
      {process.env.NODE_ENV === "development" && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={fillGrid}
          className="self-start border-dashed"
        >
          <WandSparklesIcon data-icon="inline-start" />
          Fill grid (dev)
        </Button>
      )}
      {/* Glides down as the tiles above grow a row */}
      <ViewTransition>
        <EventSuggestions events={events} onAdd={add} />
      </ViewTransition>
    </div>
  );
}
