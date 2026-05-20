import { createFileRoute } from '@tanstack/react-router';
import { useFlattenedQuery } from '@/hooks/use-flattened-query';
import { EmptyState } from './-empty';
import { ErrorState } from './-error';
import { usePublicListsQuery } from './-hooks';
import { Listing } from './-listing';
import { LoadMore } from './-load-more';
import { Loading } from './-loading';

export const Route = createFileRoute('/u/$username/lists/')({
	component: RouteComponent,
});

function RouteComponent() {
	const query = usePublicListsQuery();
	const flat = useFlattenedQuery(query.data, (page) => page.lists);

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
			<Listing />

			{query.hasNextPage && <LoadMore />}
		</div>
	);
}
