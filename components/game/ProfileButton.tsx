"use client";

import { UserIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import ButtonLink from "@/components/game/ButtonLink";

type Props = {
  name: string;
};

/** The person icon opening the player's profile, whose back arrow returns to this page. */
export default function ProfileButton({ name }: Props) {
  const pathname = usePathname();

  return (
    <ButtonLink
      href={`/me?${new URLSearchParams({ back: pathname })}`}
      variant="ghost"
      size="icon-xl"
      aria-label={`${name}: your profile`}
    >
      <UserIcon strokeWidth={3} />
    </ButtonLink>
  );
}
