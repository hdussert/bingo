"use client";

import { useActionState, useState } from "react";
import { renameProfile } from "@/actions/profile/renameProfile";
import { CARD_LABEL_CLASS } from "@/components/game/const";
import SaveButton from "@/components/game/SaveButton";
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
  const isChanged = name.trim() !== savedName;
  const isSaved = Boolean(state.isSaved) && !isChanged;

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <Card className="rounded-xl">
        <CardContent>
          <Field data-invalid={isInvalid}>
            <FieldLabel htmlFor="name" className={CARD_LABEL_CLASS}>
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
              Shown in every game you play or organize, and used to join new
              ones.
            </FieldDescription>
            {isInvalid && <FieldError>{state.message}</FieldError>}
          </Field>
        </CardContent>
      </Card>
      <SaveButton
        label="Save"
        size="xl"
        isPending={isPending}
        isSaved={isSaved}
        disabled={isPending || !isChanged}
      />
    </form>
  );
}
