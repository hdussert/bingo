"use client";

import { CheckIcon, CircleAlertIcon, CopyIcon } from "lucide-react";
import Link from "next/link";
import { useActionState, useState } from "react";
import { createGame } from "@/actions/game/createGame";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  DEFAULT_GRID_SIZE,
  GRID_SIZES,
  MAX_TITLE_LENGTH,
} from "@/lib/game/const";
import { newGameSchema, parseEvents } from "@/lib/game/schemas";
import type { GridSize } from "@/lib/game/types";

function toAbsoluteUrl(path: string): string {
  return new URL(path, location.origin).toString();
}

/** Lets the organizer set up a game and share its link. */
export default function NewGameForm() {
  const [state, formAction, isPending] = useActionState(createGame, {});
  const [title, setTitle] = useState("");
  const [size, setSize] = useState<GridSize>(DEFAULT_GRID_SIZE);
  const [eventsText, setEventsText] = useState("");
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "failed">(
    "idle",
  );

  const isCopied = copyStatus === "copied";
  const events = parseEvents(eventsText);
  const required = size ** 2;
  const result = newGameSchema.safeParse({ title, size, events });
  const href = state.gameId ? `/play/${state.gameId}` : null;
  // The counter already shows missing events, and an empty title only disables the button
  const liveErrors = result.success
    ? []
    : result.error.issues
        .filter(
          (issue) =>
            issue.code !== "custom" &&
            !(issue.code === "too_small" && issue.path[0] === "title"),
        )
        .map((issue) => issue.message);
  const errors = [...new Set([...liveErrors, ...(state.errors ?? [])])];

  async function copyLink() {
    if (!href) {
      return;
    }
    try {
      await navigator.clipboard.writeText(toAbsoluteUrl(href));
      setCopyStatus("copied");
      setTimeout(() => setCopyStatus("idle"), 2000);
    } catch {
      // No clipboard on plain-HTTP pages, or access refused: show the link to copy by hand
      setCopyStatus("failed");
    }
  }

  if (href) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your game is ready 🎉</CardTitle>
          <CardDescription>Share its link with the players.</CardDescription>
        </CardHeader>
        {copyStatus === "failed" && (
          <CardContent>
            <Input
              readOnly
              aria-label="Game link"
              value={toAbsoluteUrl(href)}
              onFocus={(e) => e.target.select()}
            />
          </CardContent>
        )}
        <CardFooter className="grid grid-cols-2 gap-2">
          <Button onClick={copyLink}>
            {isCopied ? (
              <CheckIcon data-icon="inline-start" />
            ) : (
              <CopyIcon data-icon="inline-start" />
            )}
            {isCopied ? "Copied!" : "Copy link"}
          </Button>
          <Button
            variant="outline"
            nativeButton={false}
            render={<Link href={href} />}
          >
            Open game
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <form action={formAction}>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="title">Title</FieldLabel>
          <Input
            id="title"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={MAX_TITLE_LENGTH}
            placeholder="Team building bingo"
          />
        </Field>

        <FieldSet>
          <FieldLegend variant="label">Grid size</FieldLegend>
          <input type="hidden" name="size" value={size} />
          <ToggleGroup
            variant="primary"
            value={[String(size)]}
            onValueChange={(value) => {
              // Tapping the selected size unselects it: keep the current size instead
              if (value.length === 0) {
                return;
              }
              setSize(Number(value[0]) as GridSize);
            }}
            className="w-full"
          >
            {GRID_SIZES.map((option) => (
              <ToggleGroupItem
                key={option}
                value={String(option)}
                className="flex-1"
              >
                {option}×{option}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </FieldSet>

        <Field>
          <div className="flex items-center justify-between">
            <FieldLabel htmlFor="events">Events, one per line</FieldLabel>
            <Badge
              variant={events.length >= required ? "default" : "secondary"}
            >
              {events.length} / {required}
            </Badge>
          </div>
          <Textarea
            id="events"
            name="events"
            value={eventsText}
            onChange={(e) => setEventsText(e.target.value)}
            placeholder={"Greg says kudos\nBakari talks about AI\n…"}
            className="min-h-48"
          />
          <FieldDescription>
            At least {required} events for a {size}×{size} grid. With more, each
            player gets a different selection.
          </FieldDescription>
        </Field>

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

        <Button type="submit" disabled={!result.success || isPending}>
          {isPending ? "Creating…" : "Create game"}
        </Button>
      </FieldGroup>
    </form>
  );
}
