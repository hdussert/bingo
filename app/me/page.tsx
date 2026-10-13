import { UserIcon } from "lucide-react";
import BackLink from "@/components/game/BackLink";
import ButtonLink from "@/components/game/ButtonLink";
import PageTitle from "@/components/game/PageTitle";
import RenameForm from "@/components/profile/RenameForm";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { findCurrentProfile } from "@/lib/profile/session";

/** The player's profile on this phone: their name. */
export default async function MePage() {
  const profile = await findCurrentProfile();

  return (
    <main className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-6 px-4 py-8">
      <div className="flex flex-col items-start gap-2">
        <BackLink href="/games" />
        <PageTitle>You</PageTitle>
      </div>
      {profile ? (
        <RenameForm name={profile.name} />
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
          </EmptyContent>
        </Empty>
      )}
    </main>
  );
}
