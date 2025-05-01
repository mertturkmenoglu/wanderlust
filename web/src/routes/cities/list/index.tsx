import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/cities/list/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/cities/list/"!</div>;
}
