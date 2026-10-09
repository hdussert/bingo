import BackLink from "@/components/game/BackLink";
import NewGameForm from "@/components/game/NewGameForm";
import PageTitle from "@/components/game/PageTitle";

export default function NewGamePage() {
  return (
    <main className="mx-auto flex w-full max-w-lg flex-col gap-6 px-4 py-8">
      {/* Tucked closer to the title below, like on the other pages */}
      <div className="-mb-4">
        <BackLink href="/" />
      </div>
      <NewGameForm
        header={
          <div className="flex flex-col gap-2">
            <PageTitle>New game</PageTitle>
            <p className="text-muted-foreground">
              List what might happen, pick a grid size, and share the link.
            </p>
          </div>
        }
      />
    </main>
  );
}
