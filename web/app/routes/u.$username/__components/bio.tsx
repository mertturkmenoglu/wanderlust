import { useLoaderData } from "@remix-run/react";
import { useContext } from "react";
import UserImage from "~/components/blocks/user-image";
import { ipx } from "~/lib/img-proxy";
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
  const { user, meta } = useLoaderData<typeof loader>();
  const isThisUser = auth.user?.data.username === user.username;

  return (
    <div className={cn("", className)}>
      <Banner userBannerImage={user.bannerImage ?? undefined}>
        <div className="mt-4 flex flex-col md:flex-row items-center justify-between">
          <div className="flex flex-col md:flex-row md:items-center gap-8">
            <UserImage
              src={ipx(`http://${user.profileImage ?? ""}`, "w_512")}
              imgClassName="size-48 md:size-32 ring-4 ring-white"
              fallbackClassName="size-48 md:size-32 ring-4 ring-white"
              className="size-48 md:size-32 mx-auto"
            />

            <div className="text-center flex flex-col items-center md:items-start">
              <h2 className="text-4xl font-semibold">{user.fullName}</h2>
              <h3 className="text-lg text-primary">@{user.username}</h3>
              {user.isVerified && <Verified className="mt-2" />}
            </div>
          </div>

          <div className="flex gap-2 mt-4 md:mt-0">
            <ActionButtons
              loading={auth.isLoading}
              isThisUser={isThisUser}
              isFollowing={meta.isFollowing}
              username={user.username}
            />

            <BioDropdown userId={user.id} />
          </div>
        </div>
      </Banner>

      <div className="flex flex-col justify-between mt-4">
        <div>
          <Info
            bio={user.bio}
            website={user.website}
            isBusinessAccount={user.isBusinessAccount}
          />
          <div className="flex items-center gap-4">
            {user.pronouns !== null && <Pronouns pronouns={user.pronouns} />}
          </div>
        </div>

        <Followers
          username={user.username}
          followersCount={user.followersCount}
          followingCount={user.followingCount}
          className="mx-auto md:-ml-4"
        />
      </div>

      <hr className="mt-4 hidden md:block" />

      <Tabs className="md:max-w-5xl" username={user.username} />
    </div>
  );
}
