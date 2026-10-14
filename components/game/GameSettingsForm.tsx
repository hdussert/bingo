"use client";

import { LockIcon } from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import {
  saveGameSettings,
  type SaveGameSettingsState,
} from "@/actions/game/saveGameSettings";
import { BOTTOM_BAR_CLASS, CARD_LABEL_CLASS } from "@/components/game/const";
import SaveButton from "@/components/game/SaveButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  MAX_PASSWORD_LENGTH,
  MAX_TITLE_LENGTH,
  MIN_PASSWORD_LENGTH,
} from "@/lib/game/const";
import { cn } from "@/lib/utils";

type Props = {
  gameId: string;
  title: string;
  isPrivate: boolean;
};

// Long enough to read "Saved" before the bar slides away
const SAVED_MS = 1500;

/** The game's title and who can join, for its organizer: a Save bar slides up from the bottom of the screen once something changed. */
export default function GameSettingsForm({
  gameId,
  title: savedTitle,
  isPrivate: savedIsPrivate,
}: Props) {
  const [title, setTitle] = useState(savedTitle);
  const [isPrivate, setIsPrivate] = useState(savedIsPrivate);
  const [password, setPassword] = useState("");
  // Set by each save, to keep the bar up for a moment saying it worked; a new save restarts the moment
  const [savedId, setSavedId] = useState<number | null>(null);
  const [state, formAction, isPending] = useActionState(
    async (previous: SaveGameSettingsState, formData: FormData) => {
      const next = await saveGameSettings(gameId, previous, formData);
      if (next.isSaved) {
        // The password field goes back to "keep the current one"
        setPassword("");
        // As saved
        setTitle((title) => title.trim());
        setSavedId((id) => (id ?? 0) + 1);
      }
      return next;
    },
    {},
  );

  useEffect(() => {
    if (savedId === null) {
      return;
    }
    const timeout = setTimeout(() => setSavedId(null), SAVED_MS);
    return () => clearTimeout(timeout);
  }, [savedId]);

  const isChanged =
    title.trim() !== savedTitle ||
    isPrivate !== savedIsPrivate ||
    // Only sent while the switch is on
    (isPrivate && password !== "");
  const isSavedShown = savedId !== null;
  const isBarShown = isChanged || isPending || isSavedShown;
  const isTitleInvalid = state.invalidField === "title";
  const isPasswordInvalid = state.invalidField === "password";

  return (
    <form action={formAction} className="flex flex-col gap-8">
      <Card>
        <CardContent>
          <Field data-invalid={isTitleInvalid}>
            <FieldLabel htmlFor="title" className={CARD_LABEL_CLASS}>
              Title
            </FieldLabel>
            <Input
              id="title"
              name="title"
              required
              maxLength={MAX_TITLE_LENGTH}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              aria-invalid={isTitleInvalid}
            />
            <FieldDescription>
              Players see it on their next refresh; the link stays the same.
            </FieldDescription>
            {isTitleInvalid && <FieldError>{state.message}</FieldError>}
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className={CARD_LABEL_CLASS}>Who can join</CardTitle>
          <CardDescription>
            Players already in the game keep playing without the password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* No gap: the closed password field would still leave one, so the open one brings its own */}
          <FieldGroup className="gap-0">
            <input type="hidden" name="isPrivate" value={String(isPrivate)} />
            <Field orientation="horizontal">
              <FieldContent>
                <FieldLabel htmlFor="isPrivate">
                  <LockIcon strokeWidth={3} className="size-4" />
                  Private game
                </FieldLabel>
                <FieldDescription>
                  New players need a password to join.
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
                <Field data-invalid={isPasswordInvalid} className="pt-4">
                  <Input
                    name="password"
                    aria-label={savedIsPrivate ? "New password" : "Password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    maxLength={MAX_PASSWORD_LENGTH}
                    autoComplete="off"
                    placeholder={
                      savedIsPrivate ? "Keep the current password" : "party2026"
                    }
                    aria-invalid={isPasswordInvalid}
                  />
                  <FieldDescription>
                    {savedIsPrivate
                      ? "A new one stops the old one from working."
                      : `At least ${MIN_PASSWORD_LENGTH} characters, easy to say out loud.`}
                  </FieldDescription>
                  {isPasswordInvalid && (
                    <FieldError>{state.message}</FieldError>
                  )}
                </Field>
              </CollapsibleContent>
            </Collapsible>
          </FieldGroup>
        </CardContent>
      </Card>

      {/* Off screen until something changed; inert while hidden, so it can't be tabbed to */}
      <div
        inert={!isBarShown}
        className={cn(
          "fixed inset-x-0 bottom-0 z-10 mx-auto flex max-w-lg flex-col gap-2 transition-transform duration-300 ease-out motion-reduce:transition-none",
          BOTTOM_BAR_CLASS,
          !isBarShown && "translate-y-full",
        )}
      >
        {/* Errors about the game itself, not about a field on screen */}
        {state.message && !state.invalidField && (
          <FieldError className="text-center">{state.message}</FieldError>
        )}
        <SaveButton
          label="Save"
          size="xl"
          isPending={isPending}
          isSaved={isSavedShown && !isChanged}
          disabled={isPending || !isChanged}
        />
      </div>
    </form>
  );
}
