import { Progress, ProgressLabel } from "@/components/ui/progress";

type Props = {
  count: number;
  required: number;
};

function label(count: number, required: number): string {
  const extra = count - required;
  if (extra < 0) {
    return `${required - count} more to go`;
  }
  return extra === 0 ? "Ready!" : `Ready! +${extra} extra`;
}

/** How many events are written versus how many the grid needs: the bar turns yellow once there are enough. */
export default function EventsProgress({ count, required }: Props) {
  return (
    <Progress value={Math.min(count, required)} max={required}>
      <ProgressLabel className="font-heading text-base">
        {label(count, required)}
      </ProgressLabel>
      <span className="ml-auto text-sm text-muted-foreground tabular-nums">
        {count} / {required}
      </span>
    </Progress>
  );
}
