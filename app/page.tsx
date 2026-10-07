import Link from "next/link";
import { Button } from "@/components/ui/button";
import { NAV_FORWARD } from "@/lib/transitions";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center gap-10 px-4 py-8">
      <div className="flex flex-col items-center gap-6 text-center">
        <h1 className="font-heading text-7xl text-cartoon">Bingo!</h1>
        <p className="text-muted-foreground">
          Bingo for your team building: guess what will happen, tick it when it
          does.
        </p>
      </div>
      <div className="flex flex-col gap-3">
        <Button
          size="xl"
          nativeButton={false}
          render={<Link href="/new" transitionTypes={NAV_FORWARD} />}
        >
          New game
        </Button>
        <Button
          size="xl"
          variant="outline"
          nativeButton={false}
          render={<Link href="/games" transitionTypes={NAV_FORWARD} />}
        >
          Join
        </Button>
      </div>
    </main>
  );
}
