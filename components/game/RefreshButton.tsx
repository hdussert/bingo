"use client";

import { RefreshCwIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Re-renders the page from the server, spinning while it loads. */
export default function RefreshButton() {
  const router = useRouter();
  const [isRefreshing, startTransition] = useTransition();

  return (
    <Button
      variant="outline"
      size="icon-lg"
      className="size-12"
      aria-label="Refresh games"
      disabled={isRefreshing}
      onClick={() => startTransition(() => router.refresh())}
    >
      <RefreshCwIcon
        strokeWidth={3}
        className={cn("size-7", isRefreshing && "animate-spin")}
      />
    </Button>
  );
}
