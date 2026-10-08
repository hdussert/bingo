"use client";

import { XIcon } from "lucide-react";
import { useRef, useState } from "react";
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
  const emptyTileCount = Math.min(
    Math.max(size ** 2 - events.length, 0),
    MAX_EMPTY_TILES,
  );

  // Pasted lists add one event per line; parseEvents drops blanks and duplicates
  function add(text: string) {
    onChange(parseEvents([...events, text].join("\n")));
  }

  function addDraft() {
    if (!draft.trim()) {
      return;
    }
    add(draft);
    setDraft("");
  }

  function edit(index: number) {
    setDraft(events[index]);
    onChange(events.filter((_, i) => i !== index));
    inputRef.current?.focus();
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
            onClick={addDraft}
            disabled={isFull || !draft.trim()}
          >
            Add
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      {/* Three columns whatever the grid size: five are too narrow for words on a phone */}
      <ul className="grid grid-cols-3 gap-2">
        {events.map((event, i) => (
          <li
            key={event}
            className="relative animate-in duration-200 fade-in zoom-in-50 motion-reduce:animate-none"
          >
            <button
              type="button"
              onClick={() => edit(i)}
              className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-[22%] bg-primary p-2.5 text-center text-sm leading-tight font-medium text-primary-foreground"
            >
              <span className="line-clamp-5 break-words">{event}</span>
            </button>
            <button
              type="button"
              onClick={() => onChange(events.filter((_, j) => j !== i))}
              aria-label={`Remove “${event}”`}
              className="absolute top-1 right-1 flex size-5 items-center justify-center rounded-full bg-black/30 text-white"
            >
              <XIcon strokeWidth={3} className="size-3" />
            </button>
          </li>
        ))}
        {Array.from({ length: emptyTileCount }, (_, i) => (
          <li
            key={`empty-${i}`}
            aria-hidden
            className="aspect-square rounded-[22%] border-2 border-dashed border-border"
          />
        ))}
      </ul>
    </div>
  );
}
