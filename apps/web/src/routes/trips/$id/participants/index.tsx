import { createFileRoute, getRouteApi, Link } from '@tanstack/react-router';
import { buttonVariants } from '@wanderlust/ui/components/button';
import { DockIcon, UsersIcon } from 'lucide-react';
import { useTripIsPrivileged } from '@/hooks/use-trip-is-privileged';
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
		<div className="mt-4">
			<div className="flex items-center justify-between">
				<div className="flex items-center">
					<UsersIcon className="mr-2 size-5" />
					<div className="font-medium">Participants</div>
				</div>
				{isPrivileged && trip.visibilityLevel !== 'private' && (
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
				{/** biome-ignore lint/a11y/useValidAriaRole: Not applicable, role is a prop */}
				<Item
					image={trip.owner.image ?? ''}
					name={trip.owner.name}
					role="Owner"
					isPrivileged={false}
					username={trip.owner.username}
					id={trip.owner.id}
					tripId={trip.id}
				/>

				{trip.participants.map((p) => (
					<Item
						key={p.id}
						image={p.user.image ?? ''}
						name={p.user.name}
						role={p.role}
						username={p.user.username}
						isPrivileged={isPrivileged}
						id={p.id}
						tripId={trip.id}
						className="mt-2"
					/>
				))}
			</div>
		</div>
	);
}
