import { fetchClient } from '@/lib/api';
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/trips')({
  component: RouteComponent,
  beforeLoad: async () => {
    const res = await fetchClient.GET('/api/v2/auth/me');

    if (res.data === undefined || res.error !== undefined) {
      throw redirect({
        to: '/',
      });
    }

    return res.data;
  },
});

function RouteComponent() {
  return (
    <div className="my-16 max-w-7xl mx-auto">
      <Outlet />
    </div>
  );
}
