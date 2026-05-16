import { Button } from '@wanderlust/ui/components/button';
import { useReviewsQuery } from './-hooks';

export function LoadMore() {
	const query = useReviewsQuery();

	return (
		<Button
			onClick={() => query.fetchNextPage()}
			disabled={!query.hasNextPage || query.isFetchingNextPage}
			variant="outline"
			className="mx-auto mt-4"
		>
			{query.isFetchingNextPage
				? 'Loading more...'
				: query.hasNextPage
					? 'Load More'
					: 'Nothing more to load'}
		</Button>
	);
}
