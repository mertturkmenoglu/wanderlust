import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/trips/$id/locations/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div></div>;
}
