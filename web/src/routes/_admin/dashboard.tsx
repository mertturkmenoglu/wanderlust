import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_admin/dashboard')({
  component: RouteComponent,
  beforeLoad: async ({ context: { auth } }) => {
    // TODO: Add admin role check
    if (!auth.user) {
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
