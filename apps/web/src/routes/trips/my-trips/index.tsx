import { createFileRoute } from '@tanstack/react-router';
import { Button } from '@wanderlust/ui/components/button';
import { ItemGroup } from '@wanderlust/ui/components/item';
import { Breadcrumb } from '@/components/trips/breadcrumb';
import { useFlattenedQuery } from '@/hooks/use-flattened-query';
import { useLoadMoreText } from '@/hooks/use-load-more-text';
import { seo } from '@/lib/seo';
import { EmptyState } from './-empty';
import { ErrorState } from './-error';
import { useMyTripsQuery } from './-hooks';
import { TripItem } from './-item';
import { Loading } from './-loading';

export const Route = createFileRoute('/trips/my-trips/')({
	component: RouteComponent,
	head: () =>
		seo({
			title: 'My Trips',
		}),
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
	const btnText = useLoadMoreText(query);

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
		<ItemGroup className="mt-4 gap-2">
			{flat.map((trip) => (
				<TripItem key={trip.id} trip={trip} />
			))}
			{query.hasNextPage && (
				<Button
					variant="link"
					type="button"
					onClick={() => query.fetchNextPage()}
				>
					{btnText}
				</Button>
			)}
		</ItemGroup>
	);
}
