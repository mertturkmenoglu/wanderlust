import { useLoaderData } from "react-router";
import { useContext } from "react";
import UserImage from "~/components/blocks/user-image";
import { userImage } from "~/lib/image-utils";
import { ipx } from "~/lib/img-proxy";
import { cn } from "~/lib/utils";
import { AuthContext } from "~/providers/auth-provider";
import { loader } from "../route";
import ActionButtons from "./action-buttons";
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
      <div className="mx-auto relative">
        <img
          src={user.bannerImage ?? "https://i.imgur.com/EwvUEmR.jpg"}
          alt="banner"
          className="h-64 w-full object-cover object-center rounded-lg"
        />

        <UserImage
          src={ipx(userImage(user.profileImage), "w_512")}
          imgClassName="size-48 md:size-32 ring-4 ring-white bg-white"
          fallbackClassName="size-48 md:size-32 ring-4 ring-white bg-white"
          className="size-32 inset-x-0 mx-auto sm:mx-16 absolute -bottom-16 ring-4 ring-white bg-white"
        />
      </div>

      <div className="mt-20 flex flex-col items-center gap-4 sm:flex-row sm:items-start justify-between">
        <div className="text-center flex flex-col items-center sm:items-start">
          <h2 className="text-4xl font-semibold flex items-center gap-4">
            {user.fullName} {user.isVerified && <Verified className="mt-2" />}
          </h2>
          <h3 className="text-lg text-primary">@{user.username}</h3>
        </div>

        <div className="flex items-start gap-2">
          <ActionButtons
            loading={auth.isLoading}
            isThisUser={isThisUser}
            isFollowing={meta.isFollowing}
            username={user.username}
          />

          <BioDropdown userId={user.id} />
        </div>
      </div>

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
          className="mx-auto sm:-ml-4"
        />
      </div>

      <Tabs className="md:max-w-5xl" username={user.username} />
    </div>
  );
}
