import { ChevronDownIcon, LightbulbIcon, PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { EVENT_SUGGESTIONS } from "@/lib/game/const";

type Props = {
  events: string[];
  onAdd: (event: string) => void;
};

/** Ready-made events to tap, minus the ones already in the game, folded away until asked for. */
export default function EventSuggestions({ events, onAdd }: Props) {
  const added = new Set(events.map((event) => event.toLowerCase()));
  const suggestions = EVENT_SUGGESTIONS.filter(
    (suggestion) => !added.has(suggestion.toLowerCase()),
  );
  if (suggestions.length === 0) {
    return null;
  }

  return (
    <Collapsible className="flex flex-col gap-3">
      <CollapsibleTrigger
        render={<Button type="button" variant="outline" className="group" />}
      >
        <LightbulbIcon data-icon="inline-start" />
        Need ideas?
        <ChevronDownIcon
          data-icon="inline-end"
          className="transition-transform group-data-panel-open:rotate-180"
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="flex flex-wrap gap-2">
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
      </CollapsibleContent>
    </Collapsible>
  );
}
