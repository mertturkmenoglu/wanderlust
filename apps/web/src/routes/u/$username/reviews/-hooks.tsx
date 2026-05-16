import { useInfiniteQuery } from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';
import { orpc } from '@/lib/orpc';

export function useReviewsQuery() {
	const { username } = useParams({ from: '/u/$username/reviews/' });

	return useInfiniteQuery(
		orpc.reviews.listByUsername.infiniteOptions({
			input: (page) => ({
				username,
				page,
				pageSize: 10,
			}),
			initialPageParam: 1,
			getNextPageParam: (lastPage) => {
				return lastPage.pagination.hasNext
					? lastPage.pagination.page + 1
					: null;
			},
			retry: false,
			enabled: username !== '',
		}),
	);
}
