import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/trips')({
  component: RouteComponent,
  beforeLoad: async ({ context: { auth } }) => {
    if (!auth.user) {
      throw redirect({
        to: '/',
      });
    }
  },
});

function RouteComponent() {
  return (
    <div className="my-16 max-w-7xl mx-auto">
      <Outlet />
    </div>
  );
}
