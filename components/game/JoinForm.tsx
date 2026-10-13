"use client";

import { CircleAlertIcon, EyeIcon, EyeOffIcon } from "lucide-react";
import Link from "next/link";
import { addTransitionType, useActionState, useState } from "react";
import { joinGame, type JoinGameState } from "@/actions/game/joinGame";
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
import { CARD_LABEL_CLASS } from "@/components/game/const";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { MAX_NAME_LENGTH, MAX_PASSWORD_LENGTH } from "@/lib/game/const";
import { withBackToGame } from "@/lib/game/links";
import { NAV_FORWARD } from "@/lib/transitions";

type Props = {
  gameId: string;
  /** The name the player used last time, if they played before on this phone. */
  defaultName: string;
  /** A private game this phone hasn't unlocked yet. */
  needsPassword: boolean;
};

/** Asks the player's name (and the password of a private game), then slides to their new grid. */
export default function JoinForm({
  gameId,
  defaultName,
  needsPassword,
}: Props) {
  const [state, formAction, isPending] = useActionState(
    (previous: JoinGameState, formData: FormData) => {
      // Once joined, the page comes back with the grid in place of the form: slides to it like a page change
      NAV_FORWARD.forEach(addTransitionType);
      return joinGame(gameId, previous, formData);
    },
    {},
  );
  // Controlled: an uncontrolled field can't take the name echoed back with an error as its new default
  const [name, setName] = useState(defaultName);
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const isNameInvalid = state.invalidField === "name";
  // Without a password field (the phone's unlock expired since the page loaded), its error goes in the alert
  const isPasswordInvalid = needsPassword && state.invalidField === "password";

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <Card>
        <CardContent>
          <FieldGroup className="gap-6">
            <Field data-invalid={isNameInvalid}>
              <FieldLabel htmlFor="name" className={CARD_LABEL_CLASS}>
                Your name
              </FieldLabel>
              <Input
                id="name"
                name="name"
                required
                // The one thing to do on this page (iOS still waits for a tap to open the keyboard)
                autoFocus
                maxLength={MAX_NAME_LENGTH}
                autoComplete="given-name"
                placeholder="Greg"
                value={name}
                onChange={(e) => setName(e.target.value)}
                aria-invalid={isNameInvalid}
              />
              <FieldDescription>
                Shown to the other players on the leaderboard.
                {defaultName && " Changing it renames you in all your games."}
                {/* A phone without a profile: maybe a new phone of someone who already plays */}
                {!defaultName && (
                  <>
                    {" "}
                    <Link
                      href={withBackToGame("/recover", gameId)}
                      transitionTypes={NAV_FORWARD}
                      className="text-primary"
                    >
                      Played on another phone?
                    </Link>
                  </>
                )}
              </FieldDescription>
              {isNameInvalid && <FieldError>{state.message}</FieldError>}
            </Field>

            {needsPassword && (
              <Field data-invalid={isPasswordInvalid}>
                <FieldLabel htmlFor="password" className={CARD_LABEL_CLASS}>
                  Password
                </FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    id="password"
                    name="password"
                    type={isPasswordShown ? "text" : "password"}
                    // Fredoka's dots are small and tight: spread them out while hidden
                    className={
                      isPasswordShown ? undefined : "text-2xl tracking-[0.2em]"
                    }
                    required
                    maxLength={MAX_PASSWORD_LENGTH}
                    autoComplete="off"
                    aria-invalid={isPasswordInvalid}
                  />
                  <InputGroupAddon align="inline-end">
                    <InputGroupButton
                      size="icon-sm"
                      onClick={() => setIsPasswordShown((isShown) => !isShown)}
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

      {/* Errors about the game itself, not about a field on screen */}
      {state.message && !isNameInvalid && !isPasswordInvalid && (
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
