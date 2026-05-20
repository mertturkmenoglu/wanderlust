import { createFileRoute } from '@tanstack/react-router';
import { useFlattenedQuery } from '@/hooks/use-flattened-query';
import { EmptyState } from './-empty';
import { ErrorState } from './-error';
import { useReviewsQuery } from './-hooks';
import { List } from './-list';
import { LoadMore } from './-load-more';
import { Loading } from './-loading';

export const Route = createFileRoute('/u/$username/reviews/')({
	component: RouteComponent,
});

function RouteComponent() {
	const query = useReviewsQuery();
	const flat = useFlattenedQuery(query.data, (p) => p.reviews);

	if (query.isLoading) {
		return <Loading />;
	}

	if (query.isError) {
		return <ErrorState />;
	}

	if (flat.length === 0) {
		return <EmptyState />;
	}

	return (
		<div className="flex flex-col">
			<List />

			{query.hasNextPage && <LoadMore />}
		</div>
	);
}
