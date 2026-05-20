import { createFileRoute } from '@tanstack/react-router';
import { useFlattenedQuery } from '@/hooks/use-flattened-query';
import { EmptyState } from './-empty';
import { ErrorState } from './-error';
import { useFavoritesQuery } from './-hooks';
import { List } from './-list';
import { LoadMore } from './-load-more';
import { Loading } from './-loading';

export const Route = createFileRoute('/u/$username/favorites/')({
	component: RouteComponent,
});

function RouteComponent() {
	const query = useFavoritesQuery();
	const flat = useFlattenedQuery(query.data, (p) => p.favorites);

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
