"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

const REFRESH_INTERVAL_MS = 3_000;

/** Keeps the page live: re-renders it from the server every few seconds while it's visible. */
export default function AutoRefresh() {
  const router = useRouter();

  useEffect(() => {
    function refreshIfVisible() {
      if (!document.hidden) {
        router.refresh();
      }
    }
    const interval = setInterval(refreshIfVisible, REFRESH_INTERVAL_MS);
    // Back from a locked phone or another app: catch up right away
    document.addEventListener("visibilitychange", refreshIfVisible);
    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", refreshIfVisible);
    };
  }, [router]);

  return null;
}
