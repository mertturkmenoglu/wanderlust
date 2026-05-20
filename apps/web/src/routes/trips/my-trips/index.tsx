import { createFileRoute } from '@tanstack/react-router';
import { ItemGroup } from '@wanderlust/ui/components/item';
import { Breadcrumb } from '@/components/trips/breadcrumb';
import { useFlattenedQuery } from '@/hooks/use-flattened-query';
import { EmptyState } from './-empty';
import { ErrorState } from './-error';
import { useMyTripsQuery } from './-hooks';
import { TripItem } from './-item';
import { Loading } from './-loading';

export const Route = createFileRoute('/trips/my-trips/')({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div>
			<Breadcrumb items={[{ name: 'My Trips', href: '/trips/my-trips' }]} />
			<Content />
		</div>
	);
}

function Content() {
	const query = useMyTripsQuery();
	const flat = useFlattenedQuery(query.data, (p) => p.trips);

	if (query.isPending) {
		return <Loading />;
	}

	if (query.error) {
		return <ErrorState />;
	}

	if (flat.length === 0) {
		return <EmptyState />;
	}

	return (
		<ItemGroup className="mt-4">
			{flat.map((trip) => (
				<TripItem key={trip.id} trip={trip} />
			))}
		</ItemGroup>
	);
}
