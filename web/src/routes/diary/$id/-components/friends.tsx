import AppMessage from '@/components/blocks/app-message';
import UserCard from '@/components/blocks/user-card';
import { getRouteApi, Link } from '@tanstack/react-router';

export default function Friends() {
  const route = getRouteApi('/diary/$id/');
  const { diary } = route.useLoaderData();

  return (
    <>
      <div className="text-xl font-medium">Friends</div>
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {diary.friends.length === 0 && (
          <div className="col-span-full">
            <AppMessage
              emptyMessage="No users"
              showBackButton={false}
              className=""
            />
          </div>
        )}
        {diary.friends.map((f) => (
          <Link
            to="/u/$username"
            key={f.id}
            params={{
              username: f.username,
            }}
          >
            <UserCard
              fullName={f.fullName}
              image={f.profileImage ?? '/profile.png'}
              username={f.username}
            />
          </Link>
        ))}
      </div>
    </>
  );
}
