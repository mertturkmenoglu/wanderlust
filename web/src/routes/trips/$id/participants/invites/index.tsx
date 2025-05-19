import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/trips/$id/participants/invites/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/trips/$id/participants/invites/"!</div>;
}
