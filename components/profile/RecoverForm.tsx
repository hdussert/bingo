"use client";

import { CircleAlertIcon } from "lucide-react";
import { useActionState, useState } from "react";
import { recoverProfile } from "@/actions/profile/recoverProfile";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type Props = {
  /** The code from the link opened, if any. */
  defaultCode: string;
  /** The name of the profile this phone already has, which the code replaces. */
  currentName: string | null;
};

/** Takes the code shown on another phone, to play here as the same player. */
export default function RecoverForm({ defaultCode, currentName }: Props) {
  const [state, formAction, isPending] = useActionState(recoverProfile, {});
  const [code, setCode] = useState(defaultCode);
  const isInvalid = Boolean(state.message);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <Card>
        <CardContent>
          <Field data-invalid={isInvalid}>
            <FieldLabel htmlFor="code" className="font-heading text-xl">
              Your code
            </FieldLabel>
            <Input
              id="code"
              name="code"
              required
              autoFocus={!defaultCode}
              autoComplete="off"
              autoCapitalize="characters"
              spellCheck={false}
              placeholder="K7QP-9XMA-3TRB"
              className="font-mono uppercase"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              aria-invalid={isInvalid}
            />
            <FieldDescription>
              On the phone you played on: the person icon at the top of the games.
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
