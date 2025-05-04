import { api } from '@/lib/api';
import { createFileRoute, Outlet } from '@tanstack/react-router';
import Bio from './$username/-components/bio';

export const Route = createFileRoute('/u/$username')({
  component: RouteComponent,
  loader: async ({ context, params }) => {
    return context.queryClient.ensureQueryData(
      api.queryOptions('get', '/api/v2/users/{username}', {
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
  return (
    <div className=" max-w-5xl mx-auto">
      <Bio className="mt-8" />
      <Outlet />
    </div>
  );
}
