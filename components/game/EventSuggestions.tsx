import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EVENT_SUGGESTIONS } from "@/lib/game/const";

type Props = {
  events: string[];
  onAdd: (event: string) => void;
};

/** Ready-made events to tap, minus the ones already in the game. */
export default function EventSuggestions({ events, onAdd }: Props) {
  const added = new Set(events.map((event) => event.toLowerCase()));
  const suggestions = EVENT_SUGGESTIONS.filter(
    (suggestion) => !added.has(suggestion.toLowerCase()),
  );
  if (suggestions.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm text-muted-foreground">
        Need ideas? Tap to add
      </span>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion) => (
          <Button
            key={suggestion}
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onAdd(suggestion)}
          >
            <PlusIcon data-icon="inline-start" />
            {suggestion}
          </Button>
        ))}
      </div>
    </div>
  );
}
