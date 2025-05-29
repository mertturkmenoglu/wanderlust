import { api } from '@/lib/api';
import { createFileRoute, Outlet } from '@tanstack/react-router';
import { Header } from './$username/-components/header';

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
    <div className="max-w-7xl mx-auto">
      <Header className="mt-8" />
      <Outlet />
    </div>
  );
}
