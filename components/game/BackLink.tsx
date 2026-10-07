import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { NAV_BACK } from "@/lib/transitions";

type Props = {
  href: string;
};

/** A back arrow that slides the previous page back in. */
export default function BackLink({ href }: Props) {
  return (
    <Button
      variant="ghost"
      size="icon-lg"
      // Lines the arrow up with the content below the button's own padding
      className="-ml-3 size-12"
      aria-label="Back"
      nativeButton={false}
      render={<Link href={href} transitionTypes={NAV_BACK} />}
    >
      <ArrowLeftIcon strokeWidth={3} className="size-7" />
    </Button>
  );
}
