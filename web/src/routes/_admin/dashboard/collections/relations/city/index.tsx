import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute(
  '/_admin/dashboard/collections/relations/city/',
)({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <div>Collection - City Relations</div>
    </div>
  );
}
