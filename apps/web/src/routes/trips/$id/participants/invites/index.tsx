import { createFileRoute, getRouteApi } from '@tanstack/react-router';
import { ItemGroup } from '@wanderlust/ui/components/item';
import { useTripIsPrivileged } from '@/hooks/use-trip-is-privileged';
import { EmptyState } from './-empty';
import { ErrorState } from './-error';
import { Header } from './-header';
import { useListInvitesQuery } from './-hooks';
import { InviteItem } from './-item';
import { Loading } from './-loading';

export const Route = createFileRoute('/trips/$id/participants/invites/')({
	component: RouteComponent,
});

function RouteComponent() {
	const route = getRouteApi('/trips/$id');
	const { trip } = route.useLoaderData();
	const { auth } = route.useRouteContext();
	const isPrivileged = useTripIsPrivileged(trip, auth.user?.id ?? '');
	const query = useListInvitesQuery();

	if (query.isPending) {
		return <Loading />;
	}

	if (query.isError) {
		return <ErrorState />;
	}

	const invites = query.data.invites;

	if (invites.length === 0) {
		return <EmptyState />;
	}

	return (
		<div>
			<Header />

			<ItemGroup className="mt-4 gap-2">
				{invites.map((invite) => (
					<InviteItem
						key={invite.id}
						invite={invite}
						isPrivileged={isPrivileged}
					/>
				))}
			</ItemGroup>
		</div>
	);
}
