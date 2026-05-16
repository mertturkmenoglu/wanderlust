import { createFileRoute } from '@tanstack/react-router';
import { useMemo } from 'react';
import { EmptyState } from './-empty';
import { useReviewsQuery } from './-hooks';
import { List } from './-list';
import { LoadMore } from './-load-more';
import { Loading } from './-loading';

export const Route = createFileRoute('/u/$username/reviews/')({
	component: RouteComponent,
});

function RouteComponent() {
	const query = useReviewsQuery();

	const flat = useMemo(() => {
		if (!query.data) {
			return [];
		}

		return query.data.pages.flatMap((p) => p.reviews);
	}, [query.data]);

	return (
		<div className="flex flex-col">
			{query.isLoading && <Loading />}

			{query.data && flat.length === 0 && <EmptyState />}

			{query.data && <List />}

			{query.hasNextPage && <LoadMore />}
		</div>
	);
}
