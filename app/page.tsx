import NewGameForm from "@/components/game/NewGameForm";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-lg flex-col gap-6 px-4 py-8">
      <div>
        <h1 className="text-3xl font-black tracking-tight">Bingo</h1>
        <p className="text-zinc-500">
          List what might happen, pick a grid size, and share the link.
        </p>
      </div>
      <NewGameForm />
    </main>
  );
}
