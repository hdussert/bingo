import { UserIcon } from "lucide-react";
import BackLink from "@/components/game/BackLink";
import ButtonLink from "@/components/game/ButtonLink";
import PageLayout from "@/components/game/PageLayout";
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
    <PageLayout
      header={<BackLink href={backHref(back)} />}
      title="You"
      subtitle="Your name and your code."
    >
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
              Join or start a game, and this phone will remember your name and
              your games.
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
    </PageLayout>
  );
}
