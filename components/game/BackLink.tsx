import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { NAV_BACK } from "@/lib/transitions";

type Props = {
  href: string;
};

/** A "Back" link that slides the previous page back in. */
export default function BackLink({ href }: Props) {
  return (
    <Button
      variant="ghost"
      size="sm"
      nativeButton={false}
      render={<Link href={href} transitionTypes={NAV_BACK} />}
    >
      <ArrowLeftIcon data-icon="inline-start" />
      Back
    </Button>
  );
}
