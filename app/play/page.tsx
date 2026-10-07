import BrokenLink from "@/components/game/BrokenLink";

/** Links from before games were saved on the server (`/play?g=…`) can't be opened anymore. */
export default function OldPlayPage() {
  return <BrokenLink />;
}
