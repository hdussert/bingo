import BackLink from "@/components/game/BackLink";
import ProfileButton from "@/components/game/ProfileButton";
import { findCurrentProfile } from "@/lib/profile/session";

type Props = {
  /** Where the back arrow goes, if the page has one. */
  back?: string;
  /** The page's own icon buttons, left of the profile icon. */
  children?: React.ReactNode;
};

/** The top of a page: the back arrow on the left, the page's icons and the profile icon (once the phone has one) on the right. */
export default async function PageHeader({ back, children }: Props) {
  const profile = await findCurrentProfile();

  return (
    <div className="flex min-h-12 w-full items-center">
      {back && <BackLink href={back} />}
      {/* Pushed right; lines the last icon up with the content edge, like the back arrow */}
      <div className="-mr-3 ml-auto flex items-center">
        {children}
        {profile && <ProfileButton name={profile.name} />}
      </div>
    </div>
  );
}
