import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/nearby/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/nearby/"!</div>;
}
