import { UserIcon } from "lucide-react";
import BackLink from "@/components/game/BackLink";
import ButtonLink from "@/components/game/ButtonLink";
import PageTitle from "@/components/game/PageTitle";
import CodeCard from "@/components/profile/CodeCard";
import RenameForm from "@/components/profile/RenameForm";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { backHref } from "@/lib/game/links";
import { formatCode } from "@/lib/profile/code";
import { findCurrentCode, findCurrentProfile } from "@/lib/profile/session";
import { absoluteUrl } from "@/lib/url";

/** The player's profile on this phone: their name, and their code for another phone. */
export default async function MePage({ searchParams }: PageProps<"/me">) {
  const { back } = await searchParams;
  const [profile, code] = await Promise.all([
    findCurrentProfile(),
    findCurrentCode(),
  ]);
  // After the #, the code never reaches a server: not ours, not a link preview's
  const recoverUrl = await absoluteUrl(`/recover#${code ?? ""}`);

  return (
    <main className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-6 px-4 py-8">
      <div className="flex flex-col items-start gap-2">
        <BackLink href={backHref(back)} />
        <PageTitle>You</PageTitle>
      </div>
      {profile && code ? (
        <>
          <RenameForm name={profile.name} />
          <CodeCard code={formatCode(code)} url={recoverUrl} />
        </>
      ) : (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <UserIcon />
            </EmptyMedia>
            <EmptyTitle>No name yet</EmptyTitle>
            <EmptyDescription>
              Join a game: this phone remembers your name and your games.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <ButtonLink href="/games">Join a game</ButtonLink>
            <ButtonLink href="/recover" variant="link">
              Played on another phone?
            </ButtonLink>
          </EmptyContent>
        </Empty>
      )}
    </main>
  );
}
