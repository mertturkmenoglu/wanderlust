import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/trips/$id/amenities/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/trips/$id/amenities/"!</div>;
}
