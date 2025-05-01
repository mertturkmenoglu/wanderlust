import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/trips/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/trips/"!</div>;
}
