import { fetchClient } from '@/lib/api';
import {
  createFileRoute,
  Link,
  Outlet,
  redirect,
} from '@tanstack/react-router';

export const Route = createFileRoute('/_admin/dashboard')({
  component: RouteComponent,
  beforeLoad: async () => {
    const res = await fetchClient.GET('/api/v2/auth/me');

    if (!res.response.ok || res.data?.role !== 'admin') {
      throw redirect({
        to: '/',
      });
    }
  },
});

function RouteComponent() {
  return (
    <div className="my-16 max-w-7xl mx-auto">
      <div>
        <Link to="/dashboard">
          <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
            Admin Dashboard
          </h2>
        </Link>
      </div>
      <div className="my-8 flex flex-col gap-8">
        <div className="w-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
