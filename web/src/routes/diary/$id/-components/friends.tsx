import AppMessage from '@/components/blocks/app-message';
import UserCard from '@/components/blocks/user-card';
import { getRouteApi, Link } from '@tanstack/react-router';

export default function Friends() {
  const route = getRouteApi('/diary/$id/');
  const { entry } = route.useLoaderData();

  return (
    <>
      <div className="text-xl font-medium">Friends</div>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {entry.friends.length === 0 && (
          <div className="col-span-full">
            <AppMessage
              emptyMessage="No users"
              showBackButton={false}
              className=""
            />
          </div>
        )}
        {entry.friends.map((f) => (
          <Link
            to="/u/$username"
            key={f.id}
            params={{
              username: f.username,
            }}
          >
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
