import AppMessage from '@/components/blocks/app-message';
import Spinner from '@/components/kit/spinner';
import { useTripIsPrivileged } from '@/hooks/use-trip-is-privileged';
import { api } from '@/lib/api';
import { createFileRoute, getRouteApi } from '@tanstack/react-router';
import { Header } from './-header';
import { Item } from './-item';

export const Route = createFileRoute('/trips/$id/participants/invites/')({
  component: RouteComponent,
});

function RouteComponent() {
  const route = getRouteApi('/trips/$id');
  const { trip } = route.useLoaderData();
  const { auth } = route.useRouteContext();
  const isPrivileged = useTripIsPrivileged(trip, auth.user?.id ?? '');

  const invitesQuery = api.useQuery('get', '/api/v2/trips/{tripId}/invites', {
    params: {
      path: {
        tripId: trip.id,
      },
    },
  });

  if (invitesQuery.isPending) {
    return <Spinner className="my-8 mx-auto size-8" />;
  }

  if (invitesQuery.isError) {
    return (
      <AppMessage
        errorMessage="Failed to load invites"
        showBackButton={false}
        className="mt-8"
      />
    );
  }

  const invites = invitesQuery.data.invites;

  if (invites.length === 0) {
    return (
      <AppMessage
        emptyMessage="No invites yet"
        showBackButton={false}
        className="mt-8"
      />
    );
  }

  return (
    <div>
      <Header />

      <div className="mt-4">
        {invites.map((invite) => (
          <Item
            key={invite.id}
            image={invite.to.profileImage}
            name={invite.to.fullName}
            username={invite.to.username}
            role={`As: ${invite.role}`}
            isPrivileged={isPrivileged}
            className="mt-2"
          />
        ))}
      </div>
    </div>
  );
}
