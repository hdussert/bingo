import Link from "next/link";
import type { ComponentProps } from "react";
import { Button } from "@/components/ui/button";
import { NAV_FORWARD } from "@/lib/transitions";

type Props = Omit<ComponentProps<typeof Button>, "render" | "nativeButton"> & {
  href: string;
  /** How the next page slides in: forward unless told otherwise. */
  transitionTypes?: string[];
};

/** A link styled as a button, that slides to the next page. */
export default function ButtonLink({
  href,
  transitionTypes = NAV_FORWARD,
  ...props
}: Props) {
  return (
    <Button
      nativeButton={false}
      render={<Link href={href} transitionTypes={transitionTypes} />}
      {...props}
    />
  );
}
