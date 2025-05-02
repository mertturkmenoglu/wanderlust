import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/p/$id/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/p/$id/"!</div>;
}
