import { CheckIcon } from "lucide-react";
import type { ComponentProps } from "react";
import { Button } from "@/components/ui/button";

type Props = Omit<ComponentProps<typeof Button>, "type" | "children"> & {
  /** What the button does, before saving. */
  label: string;
  isPending: boolean;
  /** The values on screen are the saved ones, just saved. */
  isSaved: boolean;
};

/** A form's submit button: its label, "Saving…" while the action runs, then a check once saved. */
export default function SaveButton({
  label,
  isPending,
  isSaved,
  ...props
}: Props) {
  return (
    <Button type="submit" {...props}>
      {isSaved ? (
        <>
          <CheckIcon strokeWidth={3} data-icon="inline-start" />
          Saved
        </>
      ) : isPending ? (
        "Saving…"
      ) : (
        label
      )}
    </Button>
  );
}
