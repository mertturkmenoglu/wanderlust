import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_admin/dashboard')({
  component: RouteComponent,
  beforeLoad: async ({ context: { auth } }) => {
    if (!auth.user || auth.user.role !== 'admin') {
      throw redirect({
        to: '/',
      });
    }
  },
});

function RouteComponent() {
  return (
    <div className="my-8 max-w-7xl mx-auto">
      <Outlet />
    </div>
  );
}
