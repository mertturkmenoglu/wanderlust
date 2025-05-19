import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/trips/$id/comments/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/trips/$id/comments/"!</div>;
}
