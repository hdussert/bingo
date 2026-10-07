import NewGameForm from "@/components/game/NewGameForm";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-lg flex-col gap-6 px-4 py-8">
      <div className="flex flex-col items-center gap-6 text-center">
        <h1 className="font-heading text-7xl text-cartoon">Bingo!</h1>
        <p className="text-muted-foreground">
          List what might happen, pick a grid size, and share the link.
        </p>
      </div>
      <NewGameForm />
    </main>
  );
}
