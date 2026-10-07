import { experimental_upgradeWebSocket } from "@vercel/functions";
import { subscribeToGame } from "@/lib/game/live";

// Proxies close sockets that stay silent for too long
const PING_INTERVAL_MS = 25_000;

/** Opens a WebSocket that receives "changed" whenever the game changes. Only works on Vercel's runtime. */
export async function GET(
  _request: Request,
  { params }: RouteContext<"/api/games/[id]/live">,
) {
  const { id } = await params;
  if (id.length > 20) {
    return new Response("Unknown game", { status: 404 });
  }

  return experimental_upgradeWebSocket((ws) => {
    const ping = setInterval(() => ws.ping(), PING_INTERVAL_MS);
    // Not awaited, so the close handler is in place even if the phone leaves before it resolves
    const subscription = subscribeToGame(id, () => ws.send("changed"));
    subscription.catch(() => ws.close());
    ws.on("close", () => {
      clearInterval(ping);
      subscription.then((unsubscribe) => unsubscribe()).catch(() => {});
    });
  });
}
