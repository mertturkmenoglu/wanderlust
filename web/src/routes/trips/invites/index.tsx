import AppMessage from '@/components/blocks/app-message';
import { api } from '@/lib/api';
import { createFileRoute } from '@tanstack/react-router';
import { InviteCard } from './-card';
import { Breadcrumb } from '@/components/blocks/trips/breadcrumb';

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
      <div className="my-4 mb-96 space-y-4">
        {invites.map((invite) => (
          <InviteCard
            invite={invite}
            key={invite.id}
          />
        ))}
        {invites.length === 0 && (
          <AppMessage
            emptyMessage="No invites yet"
            showBackButton={true}
            backLink="/trips"
            backLinkText="Go to Trips page"
            className="my-8"
          />
        )}
      </div>
    </div>
  );
}
