"use client";

import { CheckIcon } from "lucide-react";
import { useActionState, useState } from "react";
import { renameGame } from "@/actions/game/renameGame";
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
import { MAX_TITLE_LENGTH } from "@/lib/game/const";

type Props = {
  gameId: string;
  title: string;
};

/** Renames the game, for its organizer. */
export default function GameTitleForm({ gameId, title: savedTitle }: Props) {
  const [state, formAction, isPending] = useActionState(
    renameGame.bind(null, gameId),
    {},
  );
  const [title, setTitle] = useState(savedTitle);
  const isInvalid = Boolean(state.message);
  const isSaved = state.savedTitle === title.trim();

  return (
    <form action={formAction}>
      <Card>
        <CardContent className="flex flex-col gap-4">
          <Field data-invalid={isInvalid}>
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
              aria-invalid={isInvalid}
            />
            <FieldDescription>
              Players see it on their next refresh; the link stays the same.
            </FieldDescription>
            {isInvalid && <FieldError>{state.message}</FieldError>}
          </Field>
          <Button
            type="submit"
            size="lg"
            variant="outline"
            disabled={isPending || title.trim() === savedTitle}
          >
            {isSaved ? (
              <>
                <CheckIcon strokeWidth={3} data-icon="inline-start" />
                Saved
              </>
            ) : isPending ? (
              "Saving…"
            ) : (
              "Rename"
            )}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}
