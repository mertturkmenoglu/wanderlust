import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_admin/dashboard/pois/drafts/$id/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_admin/dashboard/pois/drafts/$id/"!</div>;
}
