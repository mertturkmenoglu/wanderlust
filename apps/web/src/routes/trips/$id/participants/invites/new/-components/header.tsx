import { Link, useLoaderData } from '@tanstack/react-router';
import { buttonVariants } from '@wanderlust/ui/components/button';
import { DockIcon, UserPlusIcon, UsersIcon } from 'lucide-react';
import { useTripIsPrivileged } from '@/hooks/use-trip-is-privileged';

export function Header() {
	const { trip } = useLoaderData({ from: '/trips/$id' });
	const isPrivileged = useTripIsPrivileged();
	const styles = buttonVariants({ variant: 'ghost' });

	if (!isPrivileged) {
		return null;
	}

	return (
		<div className="flex items-center justify-between">
			<div className={styles}>
				<UserPlusIcon />
				<span>Invite User</span>
			</div>

			<div>
				<Link
					to="/trips/$id/participants"
					params={{
						id: trip.id,
					}}
					className={styles}
				>
					<UsersIcon />
					<span>Participants</span>
				</Link>

				<Link
					to="/trips/$id/participants/invites"
					params={{
						id: trip.id,
					}}
					className={styles}
				>
					<DockIcon />
					<span>Invites</span>
				</Link>
			</div>
		</div>
	);
}
