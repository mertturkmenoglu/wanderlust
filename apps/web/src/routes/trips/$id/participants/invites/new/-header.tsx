import { getRouteApi, Link } from '@tanstack/react-router';
import { buttonVariants } from '@wanderlust/ui/components/button';
import { DockIcon, UserPlusIcon, UsersIcon } from 'lucide-react';
import { useTripIsPrivileged } from '@/hooks/use-trip-is-privileged';

export function Header() {
	const route = getRouteApi('/trips/$id');
	const { trip } = route.useLoaderData();
	const { auth } = route.useRouteContext();
	const isPrivileged = useTripIsPrivileged(trip, auth.user?.id ?? '');

	return (
		<div className="flex items-center justify-between">
			<div className="flex items-center">
				<UserPlusIcon className="mr-2 size-5" />
				<div className="font-medium">Invite User</div>
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
						to="/trips/$id/participants/invites"
						params={{
							id: trip.id,
						}}
						className={buttonVariants({ variant: 'ghost', size: 'sm' })}
					>
						<DockIcon className="size-4" />
						<span>Invites</span>
					</Link>
				</div>
			)}
		</div>
	);
}
