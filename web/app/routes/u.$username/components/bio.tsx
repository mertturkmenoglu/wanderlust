import { useLoaderData } from "@remix-run/react";
import { useContext } from "react";
import UserImage from "~/components/blocks/user-image";
import { cn } from "~/lib/utils";
import { AuthContext } from "~/providers/auth-provider";
import { loader } from "../route";
import ActionButtons from "./action-buttons";
import Banner from "./banner";
import BioDropdown from "./bio-dropdown";
import Followers from "./followers";
import Info from "./info";
import Pronouns from "./pronouns";
import Tabs from "./tabs";
import Verified from "./verified";

type Props = {
  className?: string;
};

export default function Bio({ className }: Props) {
  const auth = useContext(AuthContext);
  const { user } = useLoaderData<typeof loader>();
  const isThisUser = auth.user?.data.username === user.username;

  return (
    <div className={cn("", className)}>
      <Banner userBannerImage={user.bannerImage ?? undefined}>
        <div className="mt-4 flex items-center justify-between">
          <UserImage
            src={user.profileImage}
            imgClassName="size-24 ring-4 ring-white"
            fallbackClassName="size-24 ring-4 ring-white"
            className="size-24"
          />

          <div className="flex gap-4">
            <ActionButtons
              loading={auth.isLoading}
              isThisUser={isThisUser}
              isFollowing={false} // TODO: Update later
              username={user.username}
            />

            <BioDropdown userId={user.id} />
          </div>
        </div>
      </Banner>

      <div className="flex flex-col justify-between md:flex-row mt-4">
        <div className="">
          <h2 className="text-2xl font-semibold">{user.fullName}</h2>
          <h3 className="text-base text-primary">@{user.username}</h3>
          {user.isVerified && <Verified />}
        </div>

        <Followers
          username={user.username}
          followersCount={user.followersCount}
          followingCount={user.followingCount}
          className="-ml-4"
        />
      </div>

      <hr className="mt-4 hidden md:block" />

      <div className="flex items-center gap-4">
        {user.pronouns !== null && <Pronouns pronouns={user.pronouns} />}
      </div>
      <Info
        bio={user.bio}
        website={user.website}
        isBusinessAccount={user.isBusinessAccount}
      />

      <Tabs className="my-4 md:max-w-5xl" username={user.username} />
    </div>
  );
}
