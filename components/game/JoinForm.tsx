"use client";

import { CircleAlertIcon, EyeIcon, EyeOffIcon } from "lucide-react";
import { useActionState, useState } from "react";
import { joinGame } from "@/actions/game/joinGame";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { MAX_NAME_LENGTH, MAX_PASSWORD_LENGTH } from "@/lib/game/const";

// Matches the card titles of the new game form
const LABEL_CLASS = "font-heading text-xl";

type Props = {
  gameId: string;
  defaultName: string;
  /** A private game this phone hasn't unlocked yet. */
  needsPassword: boolean;
};

/** Asks the player's name: a new name gets a new grid, a known one gets its grid back. */
export default function JoinForm({
  gameId,
  defaultName,
  needsPassword,
}: Props) {
  const [state, formAction, isPending] = useActionState(
    joinGame.bind(null, gameId),
    { values: { name: defaultName } },
  );
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const isNameInvalid = state.invalidField === "name";
  const isPasswordInvalid = state.invalidField === "password";

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <Card>
        <CardContent>
          <FieldGroup className="gap-6">
            <Field data-invalid={isNameInvalid}>
              <FieldLabel htmlFor="name" className={LABEL_CLASS}>
                Your name
              </FieldLabel>
              <Input
                id="name"
                name="name"
                required
                // The one thing to do on this page: open the keyboard right away
                autoFocus
                maxLength={MAX_NAME_LENGTH}
                autoComplete="given-name"
                placeholder="Greg"
                defaultValue={state.values?.name}
                aria-invalid={isNameInvalid}
              />
              <FieldDescription>
                Same name, same grid, on any phone.
              </FieldDescription>
              {isNameInvalid && <FieldError>{state.message}</FieldError>}
            </Field>

            {needsPassword && (
              <Field data-invalid={isPasswordInvalid}>
                <FieldLabel htmlFor="password" className={LABEL_CLASS}>
                  Password
                </FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    id="password"
                    name="password"
                    type={isPasswordShown ? "text" : "password"}
                    required
                    maxLength={MAX_PASSWORD_LENGTH}
                    autoComplete="off"
                    aria-invalid={isPasswordInvalid}
                  />
                  <InputGroupAddon align="inline-end">
                    <InputGroupButton
                      size="icon-sm"
                      onClick={() => setIsPasswordShown(!isPasswordShown)}
                      aria-label={
                        isPasswordShown ? "Hide password" : "Show password"
                      }
                    >
                      {isPasswordShown ? <EyeOffIcon /> : <EyeIcon />}
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>
                <FieldDescription>
                  This game is private: ask the organizer for its password.
                </FieldDescription>
                {isPasswordInvalid && <FieldError>{state.message}</FieldError>}
              </Field>
            )}
          </FieldGroup>
        </CardContent>
      </Card>

      {/* Errors about the game itself, not about a field */}
      {state.message && !state.invalidField && (
        <Alert variant="destructive">
          <CircleAlertIcon />
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}

      <Button type="submit" size="xl" disabled={isPending}>
        {isPending ? "Joining…" : "Get my grid"}
      </Button>
    </form>
  );
}
