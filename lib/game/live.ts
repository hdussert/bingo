import { createClient } from "redis";

type RedisClient = Awaited<ReturnType<typeof connect>>;

// One publisher and one subscriber per server instance, shared by all its sockets:
// the free Redis tier allows few simultaneous connections
let publisher: Promise<RedisClient> | undefined;
let subscriber: Promise<RedisClient> | undefined;

function connect() {
  const url = process.env.REDIS_URL;
  if (!url) {
    throw new Error("REDIS_URL is not set: run `vercel env pull`");
  }
  const client = createClient({ url });
  // node-redis reconnects on its own, but crashes the process on an error nobody listens to
  client.on("error", (error) => console.error("Redis error", error));
  return client.connect();
}

function channel(gameId: string): string {
  return `game:${gameId}`;
}

/** Tells every phone watching the game that it changed. */
export async function publishGameChange(gameId: string): Promise<void> {
  publisher ??= connect().catch((error) => {
    publisher = undefined;
    throw error;
  });
  const client = await publisher;
  await client.publish(channel(gameId), "changed");
}

/** Calls `onChange` whenever the game changes, until the returned function is called. */
export async function subscribeToGame(
  gameId: string,
  onChange: () => void,
): Promise<() => Promise<void>> {
  subscriber ??= connect().catch((error) => {
    subscriber = undefined;
    throw error;
  });
  const client = await subscriber;
  const listener = () => onChange();
  await client.subscribe(channel(gameId), listener);
  return () => client.unsubscribe(channel(gameId), listener);
}
