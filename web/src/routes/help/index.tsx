import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/help/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/help/"!</div>;
}
