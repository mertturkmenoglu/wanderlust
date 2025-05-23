import BackLink from '@/components/blocks/back-link';
import { buttonVariants } from '@/components/ui/button';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';
import { createFileRoute, Link, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/diary/$id/edit')({
  component: RouteComponent,
  loader: async ({ context, params }) => {
    return context.queryClient.ensureQueryData(
      api.queryOptions('get', '/api/v2/diary/{id}', {
        params: {
          path: {
            id: params.id,
          },
        },
      }),
    );
  },
});

function RouteComponent() {
  const { id } = Route.useParams();

  return (
    <div className="max-w-7xl mx-auto my-8">
      <BackLink
        href={`/diary/${id}`}
        text="Go back to the diary entry"
      />

      <div className="mt-4 flex items-center gap-4">
        <Link
          to="/diary/$id/edit"
          params={{
            id,
          }}
          className={cn(buttonVariants({ variant: 'link' }), '!px-0')}
        >
          <div>Edit Info</div>
        </Link>

        <Link
          to="/diary/$id/edit/locations"
          params={{
            id,
          }}
          className={cn(buttonVariants({ variant: 'link' }), '!px-0')}
        >
          <div>Edit Locations</div>
        </Link>

        <Link
          to="/diary/$id/edit/friends"
          params={{
            id,
          }}
          className={cn(buttonVariants({ variant: 'link' }), '!px-0')}
        >
          <div>Edit Friends</div>
        </Link>

        <Link
          to="/diary/$id/edit/media"
          params={{
            id,
          }}
          className={cn(buttonVariants({ variant: 'link' }), '!px-0')}
        >
          <div>Edit Media</div>
        </Link>
      </div>

      <Outlet />
    </div>
  );
}
