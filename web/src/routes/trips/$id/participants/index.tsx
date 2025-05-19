import { buttonVariants } from '@/components/ui/button';
import { useTripIsPrivileged } from '@/hooks/use-trip-is-privileged';
import { createFileRoute, getRouteApi, Link } from '@tanstack/react-router';
import { DockIcon, UsersIcon } from 'lucide-react';
import { Item } from './-item';

export const Route = createFileRoute('/trips/$id/participants/')({
  component: RouteComponent,
});

function RouteComponent() {
  const route = getRouteApi('/trips/$id');
  const { trip } = route.useLoaderData();
  const { auth } = route.useRouteContext();
  const isPrivileged = useTripIsPrivileged(trip, auth.user?.id ?? '');

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <UsersIcon className="size-5 mr-2" />
          <div className="font-medium">Participants</div>
        </div>
        {isPrivileged && (
          <Link
            to="/trips/$id/participants/invites"
            params={{
              id: trip.id,
            }}
            className={buttonVariants({ variant: 'ghost', size: 'sm' })}
          >
            <DockIcon className="size-4" />
            <span>Invites</span>
          </Link>
        )}
      </div>

      <div className="mt-4">
        <Item
          image={trip.owner.profileImage}
          name={trip.owner.fullName}
          role="Owner"
          isPrivileged={false}
          username={trip.owner.username}
        />

        {trip.participants.map((p) => (
          <Item
            key={p.id}
            image={p.profileImage}
            name={p.fullName}
            role={p.role}
            username={p.username}
            isPrivileged={isPrivileged}
            className="mt-2"
          />
        ))}
      </div>
    </div>
  );
}
