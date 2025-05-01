import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/trips/invites/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/trips/invites/"!</div>;
}
