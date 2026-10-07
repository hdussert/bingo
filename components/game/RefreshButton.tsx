"use client";

import { RotateCwIcon } from "lucide-react";
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
      aria-label="Refresh games"
      disabled={isRefreshing}
      onClick={() => startTransition(() => router.refresh())}
    >
      <RotateCwIcon className={cn("size-6", isRefreshing && "animate-spin")} />
    </Button>
  );
}
