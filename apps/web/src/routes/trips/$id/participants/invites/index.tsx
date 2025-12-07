import { useQuery } from '@tanstack/react-query';
import { createFileRoute, getRouteApi } from '@tanstack/react-router';
import { Spinner } from '@wanderlust/ui/components/spinner';
import { AppMessage } from '@/components/app-message';
import { useTripIsPrivileged } from '@/hooks/use-trip-is-privileged';
import { orpc } from '@/lib/orpc';
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

	const invitesQuery = useQuery(
		orpc.trips.listInvites.queryOptions({
			input: {
				id: trip.id,
			},
		}),
	);

	if (invitesQuery.isPending) {
		return (
			<div>
				<Header />
				<Spinner className="mx-auto my-8 size-8" />
			</div>
		);
	}

	if (invitesQuery.isError) {
		return (
			<div>
				<Header />

				<AppMessage
					errorMessage="Failed to load invites"
					showBackButton={false}
					className="mt-8"
				/>
			</div>
		);
	}

	const invites = invitesQuery.data.invites;

	if (invites.length === 0) {
		return (
			<div>
				<Header />

				<AppMessage
					emptyMessage="No invites yet"
					showBackButton={false}
					className="mt-8"
				/>
			</div>
		);
	}

	return (
		<div>
			<Header />

			<div className="mt-4">
				{invites.map((invite) => (
					<Item
						key={invite.id}
						image={invite.toUser.image ?? ''}
						name={invite.toUser.name}
						username={invite.toUser.username}
						role={`As: ${invite.role}`}
						isPrivileged={isPrivileged}
						className="mt-2"
						id={invite.id}
						tripId={trip.id}
					/>
				))}
			</div>
		</div>
	);
}
