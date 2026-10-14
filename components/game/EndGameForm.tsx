"use client";

import { useActionState } from "react";
import { endGame } from "@/actions/game/endGame";
import { CARD_LABEL_CLASS } from "@/components/game/const";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FieldError } from "@/components/ui/field";

type Props = {
  gameId: string;
  isEnded: boolean;
};

/** Ends the game, or reopens it after a mistake, for its organizer. */
export default function EndGameForm({ gameId, isEnded }: Props) {
  const [state, formAction, isPending] = useActionState(
    endGame.bind(null, gameId),
    {},
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <Card className="rounded-xl">
        <CardHeader>
          <CardTitle className={CARD_LABEL_CLASS}>
            {isEnded ? "Game over" : "End the game"}
          </CardTitle>
          <CardDescription>
            {isEnded
              ? "Grids are frozen and nobody can join. Reopen it to let players tick again."
              : "Freezes every grid and the leaderboard, and stops new players from joining. You can reopen it."}
          </CardDescription>
          {state.message && <FieldError>{state.message}</FieldError>}
        </CardHeader>
      </Card>
      {/* The state to switch to */}
      <input type="hidden" name="isEnded" value={String(!isEnded)} />
      <Button
        type="submit"
        size="xl"
        variant={isEnded ? "default" : "destructive"}
        disabled={isPending}
      >
        {isPending ? "Saving…" : isEnded ? "Reopen the game" : "End the game"}
      </Button>
    </form>
  );
}
