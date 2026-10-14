import ButtonLink from "@/components/game/ButtonLink";
import PageHeader from "@/components/game/PageHeader";

export default function Home() {
  return (
    // Equal rows above and below center the content on the whole screen, under the header
    <main className="mx-auto grid w-full max-w-lg flex-1 grid-rows-[1fr_auto_1fr] gap-10 px-4 py-8">
      <div className="self-start">
        <PageHeader />
      </div>
      <div className="flex flex-col gap-10">
        <div className="flex flex-col items-center gap-6 text-center">
          <h1 className="font-heading text-7xl text-cartoon">Bingo!</h1>
          <p className="text-muted-foreground">
            Bingo for your team building: guess what will happen, tick it when
            it does.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <ButtonLink href="/new" size="xl">
            New game
          </ButtonLink>
          <ButtonLink href="/games" size="xl" variant="outline">
            Join
          </ButtonLink>
        </div>
      </div>
    </main>
  );
}
