import { ArrowLeftIcon } from "lucide-react";
import ButtonLink from "@/components/game/ButtonLink";
import { NAV_BACK } from "@/lib/transitions";

type Props = {
  href: string;
};

/** A back arrow that slides the previous page back in. */
export default function BackLink({ href }: Props) {
  return (
    <ButtonLink
      href={href}
      transitionTypes={NAV_BACK}
      variant="ghost"
      size="icon-xl"
      // Lines the arrow up with the content below the button's own padding
      className="-ml-3"
      aria-label="Back"
    >
      <ArrowLeftIcon strokeWidth={3} />
    </ButtonLink>
  );
}
