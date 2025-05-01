import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/u/$username/following/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/u/$username/following/"!</div>;
}
