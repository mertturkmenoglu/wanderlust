import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/u/$username/activities/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/u/$username/activities/"!</div>;
}
