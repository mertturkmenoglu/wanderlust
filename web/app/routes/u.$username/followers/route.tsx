import { json, LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import AppMessage from "~/components/blocks/app-message";
import UserImage from "~/components/blocks/user-image";
import { getUserFollowers } from "~/lib/api-requests";
import { ipx } from "~/lib/img-proxy";

export async function loader({ params }: LoaderFunctionArgs) {
  invariant(params.username, "username is required");
  const followers = await getUserFollowers(params.username);
  return json({ followers: followers.data.followers });
}
export default function Page() {
  const { followers } = useLoaderData<typeof loader>();

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
                src={ipx(`http://${follower.profileImage ?? ""}`, "w_512")}
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
