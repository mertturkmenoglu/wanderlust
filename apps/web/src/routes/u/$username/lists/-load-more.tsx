import { Button } from '@wanderlust/ui/components/button';
import { useLoadMoreText } from '@/hooks/use-load-more-text';
import { usePublicListsQuery } from './-hooks';

export function LoadMore() {
	const query = usePublicListsQuery();
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
