"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

// Without a socket (local dev, or a network that blocks them), refresh on a timer instead
const POLL_INTERVAL_MS = 5_000;
const MAX_RECONNECT_DELAY_MS = 30_000;

type Props = {
  gameId: string;
};

/** Keeps the page up to date: re-renders it from the server whenever the game changes. */
export default function LiveUpdates({ gameId }: Props) {
  const router = useRouter();

  useEffect(() => {
    let socket: WebSocket | undefined;
    let reconnectDelay = 1_000;
    let reconnectTimer: ReturnType<typeof setTimeout> | undefined;
    let isStopped = false;

    const poll = setInterval(() => {
      if (socket?.readyState !== WebSocket.OPEN && !document.hidden) {
        router.refresh();
      }
    }, POLL_INTERVAL_MS);

    function connect() {
      const url = new URL(`/api/games/${gameId}/live`, location.href);
      url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
      socket = new WebSocket(url);
      socket.addEventListener("open", () => {
        reconnectDelay = 1_000;
        // Catch up on anything that changed while disconnected
        router.refresh();
      });
      socket.addEventListener("message", () => router.refresh());
      socket.addEventListener("close", () => {
        if (isStopped) {
          return;
        }
        reconnectTimer = setTimeout(connect, reconnectDelay);
        reconnectDelay = Math.min(reconnectDelay * 2, MAX_RECONNECT_DELAY_MS);
      });
    }

    connect();
    return () => {
      isStopped = true;
      clearInterval(poll);
      clearTimeout(reconnectTimer);
      socket?.close();
    };
  }, [gameId, router]);

  return null;
}
