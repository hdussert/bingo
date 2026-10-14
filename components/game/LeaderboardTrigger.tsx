"use client";

import type { ComponentProps } from "react";
import { leaderboardHandle } from "@/components/game/leaderboardHandle";
import { DrawerTrigger } from "@/components/ui/drawer";

/** Opens the leaderboard drawer from anywhere on the page: a `div`, so it can hold block content. */
export default function LeaderboardTrigger(props: ComponentProps<"div">) {
  return (
    <DrawerTrigger
      handle={leaderboardHandle}
      nativeButton={false}
      render={<div {...props} />}
    />
  );
}
