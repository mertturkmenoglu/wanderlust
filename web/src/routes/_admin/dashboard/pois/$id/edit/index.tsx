import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_admin/dashboard/pois/$id/edit/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <div>This is the edit info page</div>
    </div>
  );
}
