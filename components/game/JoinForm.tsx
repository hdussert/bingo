import Form from "next/form";
import { MAX_NAME_LENGTH } from "@/lib/game/const";

type Props = {
  code: string;
};

/** Asks the player's name, which picks their grid. */
export default function JoinForm({ code }: Props) {
  return (
    <Form action="/play" className="flex flex-col gap-3">
      <input type="hidden" name="g" value={code} />
      <label htmlFor="name" className="font-medium">
        Your name
      </label>
      <input
        id="name"
        name="name"
        required
        maxLength={MAX_NAME_LENGTH}
        autoComplete="given-name"
        className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-base dark:border-zinc-700 dark:bg-zinc-900"
      />
      <button
        type="submit"
        className="rounded-lg bg-violet-600 px-4 py-2.5 font-semibold text-white hover:bg-violet-700"
      >
        Get my grid
      </button>
    </Form>
  );
}
