import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/trips/planner/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/trips/planner/"!</div>;
}
