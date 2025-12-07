import { useInfiniteQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Spinner } from '@wanderlust/ui/components/spinner';
import { AppMessage } from '@/components/app-message';
import { Breadcrumb } from '@/components/trips/breadcrumb';
import { orpc } from '@/lib/orpc';
import { EmptyState } from './-components/empty';
import { TripItem } from './-components/item';

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
	const query = useInfiniteQuery(
		orpc.trips.list.infiniteOptions({
			input: (page) => ({
				page,
				pageSize: 10,
			}),
			initialPageParam: 1,
			getNextPageParam: (last) =>
				last.pagination.hasNext ? last.pagination.page + 1 : undefined,
		}),
	);

	if (query.isPending) {
		return (
			<div>
				<Spinner className="mx-auto my-32 size-12" />
			</div>
		);
	}

	if (query.error) {
		return (
			<AppMessage
				errorMessage={query.error.message ?? 'Something went wrong'}
				backLink="/trips"
				backLinkText="Go to Trips page"
				className="my-16"
			/>
		);
	}

	const trips = query.data.pages.flatMap((page) => page.trips);

	if (trips.length === 0) {
		return <EmptyState />;
	}

	return (
		<div className="mt-4">
			{trips.map((trip) => (
				<TripItem key={trip.id} trip={trip} />
			))}
		</div>
	);
}
