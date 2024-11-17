import { LoaderFunctionArgs, json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import AppMessage from "~/components/blocks/app-message";
import UserImage from "~/components/blocks/user-image";
import { getUserFollowing } from "~/lib/api";
import { userImage } from "~/lib/image-utils";
import { ipx } from "~/lib/img-proxy";

export async function loader({ params }: LoaderFunctionArgs) {
  invariant(params.username, "username is required");
  const following = await getUserFollowing(params.username);
  return json({ following: following.data.following });
}

export default function Page() {
  const { following } = useLoaderData<typeof loader>();

  return (
    <div className="my-8">
      {following.length === 0 && (
        <AppMessage
          emptyMessage="This user has no followers yet"
          showBackButton={false}
        />
      )}

      {following.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {following.map((following) => (
            <Link
              to={`/u/${following.username}`}
              key={following.id}
              className="flex gap-4 items-center hover:bg-muted p-2 rounded-md"
            >
              <UserImage
                src={ipx(userImage(following.profileImage), "w_512")}
                className="size-32"
              />
              <div>
                <div className="text-lg">{following.fullName}</div>
                <div className="text-muted-foreground">
                  @{following.username}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
