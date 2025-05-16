import { api } from '@/lib/api';
import { createFileRoute } from '@tanstack/react-router';
import { Breadcrumb } from '../-breadcrumb';
import { InviteCard } from './-card';

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
      <div className="my-4 mb-96">
        {invites.map((invite) => (
          <InviteCard invite={invite} key={invite.id} />
        ))}
      </div>
    </div>
  );
}
