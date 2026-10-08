"use client";

import { useActionState } from "react";
import { joinGame } from "@/actions/game/joinGame";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { MAX_NAME_LENGTH, MAX_PASSWORD_LENGTH } from "@/lib/game/const";

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Join the game</CardTitle>
        <CardDescription>
          Your name picks your grid: enter the same name to get it back, on any
          phone.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction}>
          <FieldGroup>
            <Field data-invalid={state.invalidField === "name"}>
              <FieldLabel htmlFor="name">Your name</FieldLabel>
              <Input
                id="name"
                name="name"
                required
                maxLength={MAX_NAME_LENGTH}
                autoComplete="given-name"
                defaultValue={state.values?.name}
                aria-invalid={state.invalidField === "name"}
              />
            </Field>
            {needsPassword && (
              <Field data-invalid={state.invalidField === "password"}>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  maxLength={MAX_PASSWORD_LENGTH}
                  autoComplete="off"
                  aria-invalid={state.invalidField === "password"}
                />
                <FieldDescription>
                  This game is private: ask the organizer for its password.
                </FieldDescription>
              </Field>
            )}
            {state.message && <FieldError>{state.message}</FieldError>}
            <Button type="submit" disabled={isPending}>
              {isPending ? "Joining…" : "Get my grid"}
            </Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
