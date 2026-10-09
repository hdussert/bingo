"use client";

import { TrophyIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { pluralize } from "@/lib/game/format";

type Props = {
  playerCount: number;
  /** The leaderboard itself. */
  children: React.ReactNode;
};

/** A trophy button that slides the leaderboard up from the bottom. */
export default function LeaderboardDrawer({ playerCount, children }: Props) {
  return (
    <Drawer showSwipeHandle>
      <DrawerTrigger
        render={
          <Button variant="ghost" size="icon-xl" aria-label="Leaderboard" />
        }
      >
        <TrophyIcon strokeWidth={2.5} />
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="flex-row items-center justify-between gap-4 pb-2">
          <DrawerTitle className="flex items-center gap-2 text-2xl">
            <TrophyIcon strokeWidth={3} className="size-6" />
            Leaderboard
          </DrawerTitle>
          <span className="flex items-center gap-2 text-sm text-muted-foreground">
            {/* The page refreshes on its own: the dot says it's live */}
            <span className="size-2 animate-pulse rounded-full bg-highlight motion-reduce:animate-none" />
            {pluralize(playerCount, "player")}
          </span>
        </DrawerHeader>
        <div className="overflow-y-auto px-4 pt-2 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
          {children}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
