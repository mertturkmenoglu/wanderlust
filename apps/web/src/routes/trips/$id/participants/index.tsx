import { createFileRoute, getRouteApi, Link } from '@tanstack/react-router';
import { buttonVariants } from '@wanderlust/ui/components/button';
import { ItemGroup } from '@wanderlust/ui/components/item';
import { DockIcon } from 'lucide-react';
import { useTripIsPrivileged } from '@/hooks/use-trip-is-privileged';
import type { TripParticipant } from './-hooks';
import { ParticipantItem } from './-item';

export const Route = createFileRoute('/trips/$id/participants/')({
	component: RouteComponent,
});

function RouteComponent() {
	const route = getRouteApi('/trips/$id');
	const { trip } = route.useLoaderData();
	const { auth } = route.useRouteContext();
	const isPrivileged = useTripIsPrivileged(trip, auth.user?.id ?? '');
	const canInvite = isPrivileged && trip.visibilityLevel !== 'private';
	const allParticipants: TripParticipant[] = [
		{
			id: '',
			tripId: trip.id,
			userId: trip.owner.id,
			role: 'owner',
			user: {
				id: trip.owner.id,
				name: trip.owner.name,
				username: trip.owner.username,
				image: trip.owner.image,
			},
		},
		...trip.participants,
	];

	return (
		<div className="flex flex-col">
			{canInvite && (
				<Link
					to="/trips/$id/participants/invites"
					params={{
						id: trip.id,
					}}
					className={buttonVariants({
						variant: 'ghost',
						size: 'sm',
						className: 'ml-auto',
					})}
				>
					<DockIcon className="size-4" />
					<span>Invites</span>
				</Link>
			)}

			<ItemGroup className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
				{allParticipants.map((p) => (
					<ParticipantItem
						key={p.userId}
						participant={p}
						isPrivileged={isPrivileged}
					/>
				))}
			</ItemGroup>
		</div>
	);
}
