import { AppMessage } from '@/components/blocks/app-message';
import { UserImage } from '@/components/blocks/user-image';
import { api } from '@/lib/api';
import { userImage } from '@/lib/image';
import { ipx } from '@/lib/ipx';
import { createFileRoute, Link } from '@tanstack/react-router';

export const Route = createFileRoute('/u/$username/followers/')({
  component: RouteComponent,
  loader: ({ context, params }) => {
    return context.queryClient.ensureQueryData(
      api.queryOptions('get', '/api/v2/users/{username}/followers', {
        params: {
          path: {
            username: params.username,
          },
        },
      }),
    );
  },
});

function RouteComponent() {
  const { followers } = Route.useLoaderData();

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
              to="/u/$username"
              params={{ username: follower.username }}
              key={follower.id}
              className="flex gap-4 items-center hover:bg-muted p-2 rounded-md"
            >
              <UserImage
                src={ipx(userImage(follower.profileImage), 'w_512')}
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
