import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/diary/')({
  component: RouteComponent,
  
});

function RouteComponent() {
  return <div>Hello "/diary/"!</div>;
}
