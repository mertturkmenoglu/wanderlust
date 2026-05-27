import { useFlattenedQuery } from '@/hooks/use-flattened-query';
import { EmptyState } from './-empty';
import { ErrorState } from './-error';
import { useListsQuery } from './-hooks';
import { ItemComponent } from './-item';
import { LoadMore } from './-load-more';
import { Loading } from './-loading';

export function Content() {
	const query = useListsQuery();
	const flat = useFlattenedQuery(query.data, (l) => l.lists);
	const isEmpty = flat.length === 0;

	if (query.isLoading) {
		return <Loading />;
	}

	if (isEmpty) {
		return <EmptyState />;
	}

	if (query.error) {
		return <ErrorState />;
	}

	return (
		<div className="mt-4 grid grid-cols-1 gap-2">
			{flat.map((list) => (
				<ItemComponent key={list.id} list={list} />
			))}
			<LoadMore />
		</div>
	);
}
