import { headers } from "next/headers";

/** The full URL of a path on this site, from the current request's host. Server only. */
export async function absoluteUrl(path: string): Promise<string> {
  const requestHeaders = await headers();
  const protocol = requestHeaders.get("x-forwarded-proto") ?? "http";
  return `${protocol}://${requestHeaders.get("host")}${path}`;
}
