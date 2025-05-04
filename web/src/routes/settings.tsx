import { fetchClient } from '@/lib/api';
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import Sidebar from './settings/-components/sidebar';

export const Route = createFileRoute('/settings')({
  component: RouteComponent,
  beforeLoad: async () => {
    const res = await fetchClient.GET('/api/v2/auth/me');
    if (res.data === undefined) {
      throw redirect({
        to: '/sign-in',
      });
    }
    return { auth: res.data };
  },
});

function RouteComponent() {
  return (
    <div className="flex w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10">
        <div className="mx-auto grid w-full max-w-7xl gap-2">
          <h2 className="text-3xl font-semibold">Settings</h2>
        </div>
        <div className="mx-auto grid w-full max-w-7xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
          <Sidebar />
          <div className="grid gap-6">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
