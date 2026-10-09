import { Badge } from "@/components/ui/badge";
import { pluralize } from "@/lib/game/format";
import { cn } from "@/lib/utils";

type Props = {
  lineCount: number;
  hasBingo: boolean;
};

/** A player's line count, highlighted once they have a bingo. */
export default function LinesBadge({ lineCount, hasBingo }: Props) {
  return (
    <Badge
      className={cn(hasBingo && "bg-highlight text-highlight-foreground")}
      variant={hasBingo ? "default" : "outline"}
    >
      {pluralize(lineCount, "line")}
    </Badge>
  );
}
