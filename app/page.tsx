import ButtonLink from "@/components/game/ButtonLink";
import CenteredPageLayout from "@/components/game/CenteredPageLayout";
import PageHeader from "@/components/game/PageHeader";

export default function Home() {
  return (
    <CenteredPageLayout header={<PageHeader />}>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col items-center gap-4 text-center">
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
    </CenteredPageLayout>
  );
}
