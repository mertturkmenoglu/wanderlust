import { api } from '@/lib/api';
import { createFileRoute } from '@tanstack/react-router';
import { Breadcrumb } from '../-breadcrumb';

export const Route = createFileRoute('/trips/invites/')({
  component: RouteComponent,
  loader: ({ context }) => {
    return context.queryClient.ensureQueryData(
      api.queryOptions('get', '/api/v2/trips/invites'),
    );
  },
});

function RouteComponent() {
  const { invites } = Route.useLoaderData();

  return (
    <div>
      <Breadcrumb items={[{ name: 'My Invites', href: '/trips/invites' }]} />
      <pre className="mt-8">{JSON.stringify(invites, null, 2)}</pre>
    </div>
  );
}
