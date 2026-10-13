"use client";

import { CircleAlertIcon } from "lucide-react";
import { useActionState, useSyncExternalStore } from "react";
import { recoverProfile } from "@/actions/profile/recoverProfile";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CARD_LABEL_CLASS } from "@/components/game/const";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

function subscribeToHash(onChange: () => void) {
  window.addEventListener("hashchange", onChange);
  return () => window.removeEventListener("hashchange", onChange);
}

type Props = {
  /** The name of the profile this phone already has, which the code replaces. */
  currentName: string | null;
};

/** Takes the code shown on another phone, to play here as the same player. */
export default function RecoverForm({ currentName }: Props) {
  const [state, formAction, isPending] = useActionState(recoverProfile, {});
  // The code from the link opened, after the #: the browser never sends it, so it stays out of server logs and link previews
  const linkCode = useSyncExternalStore(
    subscribeToHash,
    () => decodeURIComponent(location.hash.slice(1)),
    () => "",
  );
  const isInvalid = Boolean(state.message);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <Card>
        <CardContent>
          <Field data-invalid={isInvalid}>
            <FieldLabel htmlFor="code" className={CARD_LABEL_CLASS}>
              Your code
            </FieldLabel>
            <Input
              id="code"
              name="code"
              required
              autoFocus={!linkCode}
              autoComplete="off"
              autoCapitalize="characters"
              spellCheck={false}
              placeholder="K7QP-9XMA-3TRB"
              className="font-mono uppercase"
              // Keyed: filled in once the code is read from the link, after hydration
              key={linkCode}
              defaultValue={linkCode}
              aria-invalid={isInvalid}
            />
            <FieldDescription>
              On the phone you played on: the person icon at the top of the
              games.
            </FieldDescription>
            {isInvalid && <FieldError>{state.message}</FieldError>}
          </Field>
        </CardContent>
      </Card>
      {currentName && (
        <Alert>
          <CircleAlertIcon />
          <AlertDescription>
            This phone plays as {currentName}: with the code, it plays as the
            other player instead. Note {currentName}&apos;s code first to keep
            their games.
          </AlertDescription>
        </Alert>
      )}
      <Button type="submit" size="xl" disabled={isPending}>
        {isPending ? "Checking…" : "Get my games"}
      </Button>
    </form>
  );
}
