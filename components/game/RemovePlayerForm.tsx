"use client";

import { useActionState, useState } from "react";
import { removePlayer } from "@/actions/game/removePlayer";
import { Button } from "@/components/ui/button";

type Props = {
  gameId: string;
  profileId: string;
  name: string;
};

/** Removes a player from the game, after a second tap: their grid is lost. */
export default function RemovePlayerForm({ gameId, profileId, name }: Props) {
  const [state, formAction, isPending] = useActionState(
    removePlayer.bind(null, gameId),
    {},
  );
  const [isConfirming, setIsConfirming] = useState(false);

  return (
    <form action={formAction} className="flex items-center gap-2">
      <input type="hidden" name="profileId" value={profileId} />
      {state.message && (
        <span className="text-sm text-destructive">{state.message}</span>
      )}
      {isConfirming ? (
        <>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setIsConfirming(false)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="destructive"
            size="sm"
            disabled={isPending}
            aria-label={`Confirm removing ${name}`}
          >
            {isPending ? "Removing…" : "Remove"}
          </Button>
        </>
      ) : (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setIsConfirming(true)}
          aria-label={`Remove ${name}`}
        >
          Remove
        </Button>
      )}
    </form>
  );
}
