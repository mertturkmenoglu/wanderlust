import { Link, useLoaderData } from "@remix-run/react";
import { loader } from "../route";
import AppMessage from "~/components/blocks/app-message";
import UserCard from "~/components/blocks/user-card";

export default function Friends() {
  const { entry } = useLoaderData<typeof loader>();

  return (
    <>
      <div className="text-xl font-medium">Friends</div>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {entry.friends.length === 0 && (
          <div className="col-span-full">
            <AppMessage
              emptyMessage="You haven't added any friends."
              showBackButton={false}
              className="my-8"
            />
          </div>
        )}
        {entry.friends.map((f) => (
          <Link to={`/u/${f.username}`}>
            <UserCard
              fullName={f.fullName}
              image={f.profileImage}
              username={f.username}
            />
          </Link>
        ))}
      </div>
    </>
  );
}
