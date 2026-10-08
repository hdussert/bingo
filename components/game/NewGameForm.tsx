"use client";

import { CircleAlertIcon, LockIcon } from "lucide-react";
import { startTransition, useActionState, useState } from "react";
import { createGame } from "@/actions/game/createGame";
import EventSuggestions from "@/components/game/EventSuggestions";
import EventsProgress from "@/components/game/EventsProgress";
import EventsTileInput from "@/components/game/EventsTileInput";
import FormStep from "@/components/game/FormStep";
import GameReady from "@/components/game/GameReady";
import GridSizePicker from "@/components/game/GridSizePicker";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  DEFAULT_GRID_SIZE,
  MAX_PASSWORD_LENGTH,
  MAX_TITLE_LENGTH,
  MIN_PASSWORD_LENGTH,
} from "@/lib/game/const";
import { newGameSchema } from "@/lib/game/schemas";
import type { GridSize } from "@/lib/game/types";

/** Lets the organizer set up a game, step by step, and share its link. */
export default function NewGameForm() {
  const [state, formAction, isPending] = useActionState(createGame, {});
  const [title, setTitle] = useState("");
  const [size, setSize] = useState<GridSize>(DEFAULT_GRID_SIZE);
  const [events, setEvents] = useState<string[]>([]);
  const [isPrivate, setIsPrivate] = useState(false);
  const [password, setPassword] = useState("");

  const result = newGameSchema.safeParse({
    title,
    size,
    events,
    password: isPrivate ? password : null,
  });
  // The progress bar already shows missing events, and an empty title or password only disables the button
  const liveErrors = result.success
    ? []
    : result.error.issues
        .filter(
          (issue) =>
            issue.code !== "custom" &&
            !(issue.code === "too_small" && issue.path[0] === "title") &&
            !(issue.code === "too_small" && password === ""),
        )
        .map((issue) => issue.message);
  const errors = [...new Set([...liveErrors, ...(state.errors ?? [])])];

  if (state.gameId) {
    return <GameReady gameId={state.gameId} />;
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <FormStep step={1} title="Name it">
        <Input
          name="title"
          aria-label="Game title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={MAX_TITLE_LENGTH}
          placeholder="Team building bingo"
        />
      </FormStep>

      <FormStep step={2} title="Grid size">
        <GridSizePicker size={size} onChange={setSize} />
      </FormStep>

      <FormStep
        step={3}
        title="What might happen?"
        description="With more events than the grid needs, each player gets a different mix."
      >
        <FieldGroup className="gap-4">
          <input type="hidden" name="events" value={events.join("\n")} />
          <EventsProgress count={events.length} required={size ** 2} />
          <EventsTileInput events={events} size={size} onChange={setEvents} />
          <EventSuggestions
            events={events}
            onAdd={(event) =>
              // A transition, so the new tile pops in like typed ones
              startTransition(() => setEvents([...events, event]))
            }
          />
        </FieldGroup>
      </FormStep>

      <FormStep step={4} title="Who can join">
        <FieldGroup className="gap-4">
          <Field orientation="horizontal">
            <FieldContent>
              <FieldLabel htmlFor="isPrivate">
                <LockIcon strokeWidth={3} className="size-4" />
                Private game
              </FieldLabel>
              <FieldDescription>
                Players need a password to join.
              </FieldDescription>
            </FieldContent>
            <Switch
              id="isPrivate"
              checked={isPrivate}
              onCheckedChange={setIsPrivate}
            />
          </Field>
          <Collapsible open={isPrivate}>
            <CollapsibleContent>
              <Field>
                <Input
                  name="password"
                  aria-label="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  maxLength={MAX_PASSWORD_LENGTH}
                  autoComplete="off"
                  placeholder="party2026"
                />
                <FieldDescription>
                  At least {MIN_PASSWORD_LENGTH} characters. Keep it simple: you
                  will say it out loud, and case doesn&apos;t matter.
                </FieldDescription>
              </Field>
            </CollapsibleContent>
          </Collapsible>
        </FieldGroup>
      </FormStep>

      {errors.length > 0 && (
        <Alert variant="destructive">
          <CircleAlertIcon />
          <AlertDescription>
            <ul>
              {errors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Stays reachable at the bottom of the screen while scrolling through the steps */}
      <div className="sticky bottom-0 -mx-4 bg-linear-to-t from-background from-60% to-transparent px-4 pt-6 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <Button
          type="submit"
          size="xl"
          className="w-full"
          disabled={!result.success || isPending}
        >
          {isPending ? "Creating…" : "Create game"}
        </Button>
      </div>
    </form>
  );
}
