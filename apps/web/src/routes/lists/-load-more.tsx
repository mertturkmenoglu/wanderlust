import { Button } from '@wanderlust/ui/components/button';
import { useLoadMoreText } from '@/hooks/use-load-more-text';
import { useListsQuery } from './-hooks';

export function LoadMore() {
	const query = useListsQuery();
	const text = useLoadMoreText(query);

	return (
		<Button
			onClick={() => query.fetchNextPage()}
			disabled={!query.hasNextPage || query.isFetchingNextPage}
			variant="outline"
			className="mx-auto mt-4"
		>
			{text}
		</Button>
	);
}
