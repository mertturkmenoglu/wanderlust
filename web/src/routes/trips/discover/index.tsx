import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/trips/discover/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/trips/discover/"!</div>;
}
