import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

const url = process.env.DATABASE_URL;
if (!url) {
  throw new Error("DATABASE_URL is not set: run `vercel env pull`");
}

export const db = drizzle({ client: neon(url) });
