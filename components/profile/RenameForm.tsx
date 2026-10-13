"use client";

import { CheckIcon } from "lucide-react";
import { useActionState, useState } from "react";
import { renameProfile } from "@/actions/profile/renameProfile";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { MAX_NAME_LENGTH } from "@/lib/game/const";

type Props = {
  name: string;
};

/** Changes the player's name, in every game they joined. */
export default function RenameForm({ name: savedName }: Props) {
  const [state, formAction, isPending] = useActionState(renameProfile, {});
  const [name, setName] = useState(savedName);
  const isInvalid = Boolean(state.message);
  const isSaved = state.savedName === name.trim();

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <Card>
        <CardContent>
          <Field data-invalid={isInvalid}>
            <FieldLabel htmlFor="name" className="font-heading text-xl">
              Your name
            </FieldLabel>
            <Input
              id="name"
              name="name"
              required
              maxLength={MAX_NAME_LENGTH}
              autoComplete="given-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              aria-invalid={isInvalid}
            />
            <FieldDescription>
              In every game you joined, and filled in when you join a new one.
            </FieldDescription>
            {isInvalid && <FieldError>{state.message}</FieldError>}
          </Field>
        </CardContent>
      </Card>
      <Button
        type="submit"
        size="xl"
        disabled={isPending || name.trim() === savedName}
      >
        {isSaved ? (
          <>
            <CheckIcon strokeWidth={3} data-icon="inline-start" />
            Saved
          </>
        ) : isPending ? (
          "Saving…"
        ) : (
          "Save"
        )}
      </Button>
    </form>
  );
}
