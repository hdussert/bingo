"use client";

import { LockIcon } from "lucide-react";
import { useActionState, useState } from "react";
import {
  setGameAccess,
  type SetGameAccessState,
} from "@/actions/game/setGameAccess";
import { CARD_LABEL_CLASS } from "@/components/game/const";
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
import { MAX_PASSWORD_LENGTH, MIN_PASSWORD_LENGTH } from "@/lib/game/const";

type Props = {
  gameId: string;
  isPrivate: boolean;
};

/** Makes the game public, or private with a new password, for its organizer. */
export default function GameAccessForm({
  gameId,
  isPrivate: savedIsPrivate,
}: Props) {
  const [isPrivate, setIsPrivate] = useState(savedIsPrivate);
  const [password, setPassword] = useState("");
  const [state, formAction, isPending] = useActionState(
    async (previous: SetGameAccessState, formData: FormData) => {
      const next = await setGameAccess(gameId, previous, formData);
      // Saved: the password field goes back to "keep the current one"
      if (!next.message) {
        setPassword("");
      }
      return next;
    },
    {},
  );
  const isChanged = isPrivate !== savedIsPrivate || password !== "";
  const isSaved = Boolean(state.isSaved) && !isChanged;

  return (
    <form action={formAction}>
      <Card className="rounded-xl">
        <CardHeader>
          <CardTitle className={CARD_LABEL_CLASS}>Who can join</CardTitle>
          <CardDescription>
            Players already in the game keep playing without the password.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
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
                <Field data-invalid={Boolean(state.message)} className="pt-4">
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
                  />
                  <FieldDescription>
                    {savedIsPrivate
                      ? "A new one stops the old one from working."
                      : `At least ${MIN_PASSWORD_LENGTH} characters, easy to say out loud.`}
                  </FieldDescription>
                </Field>
              </CollapsibleContent>
            </Collapsible>
            {state.message && (
              <FieldError className="mt-4">{state.message}</FieldError>
            )}
          </FieldGroup>
          <SaveButton
            label="Save"
            size="lg"
            variant="outline"
            isPending={isPending}
            isSaved={isSaved}
            disabled={isPending || !isChanged}
          />
        </CardContent>
      </Card>
    </form>
  );
}
