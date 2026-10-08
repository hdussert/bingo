"use client";

import { XIcon } from "lucide-react";
import { useRef, useState } from "react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  GRID_COLUMNS,
  GRID_TEXT_SIZES,
  MAX_EVENT_LENGTH,
  MAX_EVENTS,
} from "@/lib/game/const";
import { parseEvents } from "@/lib/game/schemas";
import type { GridSize } from "@/lib/game/types";
import { cn } from "@/lib/utils";

type Props = {
  events: string[];
  size: GridSize;
  onChange: (events: string[]) => void;
};

/** Adds events one at a time as tiles laid out like the game grid, with empty tiles for the ones still needed. */
export default function EventsTileInput({ events, size, onChange }: Props) {
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const isFull = events.length >= MAX_EVENTS;
  const emptyTileCount = Math.max(size ** 2 - events.length, 0);

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
      <ul className={cn("grid gap-2", GRID_COLUMNS[size])}>
        {events.map((event, i) => (
          <li key={event} className="relative">
            <button
              type="button"
              onClick={() => edit(i)}
              className={cn(
                "flex aspect-square w-full items-center justify-center rounded-[22%] border-2 border-primary bg-primary p-1 text-center leading-tight font-medium break-words hyphens-auto text-primary-foreground",
                GRID_TEXT_SIZES[size],
              )}
            >
              {event}
            </button>
            <button
              type="button"
              onClick={() => onChange(events.filter((_, j) => j !== i))}
              aria-label={`Remove “${event}”`}
              className="absolute -top-1.5 -right-1.5 flex size-6 items-center justify-center rounded-full bg-foreground text-background shadow-sm"
            >
              <XIcon strokeWidth={3} className="size-3.5" />
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
