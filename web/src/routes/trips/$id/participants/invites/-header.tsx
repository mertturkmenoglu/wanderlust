import { buttonVariants } from '@/components/ui/button';
import { useTripIsPrivileged } from '@/hooks/use-trip-is-privileged';
import { getRouteApi, Link } from '@tanstack/react-router';
import { DockIcon, UserPlusIcon, UsersIcon } from 'lucide-react';

export function Header() {
  const route = getRouteApi('/trips/$id');
  const { trip } = route.useLoaderData();
  const { auth } = route.useRouteContext();
  const isPrivileged = useTripIsPrivileged(trip, auth.user?.id ?? '');

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <DockIcon className="size-5 mr-2" />
        <div className="font-medium">Invites</div>
      </div>
      {isPrivileged && (
        <div>
          <Link
            to="/trips/$id/participants"
            params={{
              id: trip.id,
            }}
            className={buttonVariants({ variant: 'ghost', size: 'sm' })}
          >
            <UsersIcon className="size-4" />
            <span>Participants</span>
          </Link>

          <Link
            to="/trips/$id/participants/invites/new"
            params={{
              id: trip.id,
            }}
            className={buttonVariants({ variant: 'ghost', size: 'sm' })}
          >
            <UserPlusIcon className="size-4" />
            <span>Invite User</span>
          </Link>
        </div>
      )}
    </div>
  );
}
