import { Link } from "react-router";
import invariant from "tiny-invariant";
import AppMessage from "~/components/blocks/app-message";
import UserImage from "~/components/blocks/user-image";
import { getUserFollowers } from "~/lib/api-requests";
import { userImage } from "~/lib/image-utils";
import { ipx } from "~/lib/img-proxy";
import type { Route } from "./+types/route";

export async function loader({ params }: Route.LoaderArgs) {
  invariant(params.username, "username is required");

  const followers = await getUserFollowers(params.username);

  return { followers: followers.data.followers };
}

export default function Page({ loaderData }: Route.ComponentProps) {
  const { followers } = loaderData;

  return (
    <div className="my-8">
      {followers.length === 0 && (
        <AppMessage
          emptyMessage="This user has no followers yet"
          showBackButton={false}
        />
      )}

      {followers.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {followers.map((follower) => (
            <Link
              to={`/u/${follower.username}`}
              key={follower.id}
              className="flex gap-4 items-center hover:bg-muted p-2 rounded-md"
            >
              <UserImage
                src={ipx(userImage(follower.profileImage), "w_512")}
                className="size-32"
              />
              <div>
                <div className="text-lg">{follower.fullName}</div>
                <div className="text-muted-foreground">
                  @{follower.username}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
