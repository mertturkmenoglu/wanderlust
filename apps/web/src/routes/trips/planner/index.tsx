import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/trips/planner/')({
  component: RouteComponent,
  loader: () => {
    throw redirect({
      to: '/trips',
    });
  },
});

function RouteComponent() {
  return <div />;
}
