import { AppMessage } from '@/components/blocks/app-message';
import { UserImage } from '@/components/blocks/user-image';
import { api } from '@/lib/api';
import { userImage } from '@/lib/image';
import { ipx } from '@/lib/ipx';
import { createFileRoute, Link } from '@tanstack/react-router';

export const Route = createFileRoute('/u/$username/following/')({
  component: RouteComponent,
  loader: ({ context, params }) => {
    return context.queryClient.ensureQueryData(
      api.queryOptions('get', '/api/v2/users/{username}/following', {
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
  const { following } = Route.useLoaderData();

  return (
    <div className="my-8">
      {following.length === 0 && (
        <AppMessage
          emptyMessage="This user hasn't followed anyone yet"
          showBackButton={false}
        />
      )}

      {following.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {following.map((following) => (
            <Link
              to="/u/$username"
              params={{ username: following.username }}
              key={following.id}
              className="flex gap-4 items-center hover:bg-muted p-2 rounded-md"
            >
              <UserImage
                src={ipx(userImage(following.profileImage), 'w_512')}
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
