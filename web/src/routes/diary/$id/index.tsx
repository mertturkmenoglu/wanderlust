import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/diary/$id/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/diary/$id/"!</div>;
}
