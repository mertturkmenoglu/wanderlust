import { useInfiniteQuery } from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';
import { orpc } from '@/lib/orpc';

export function useFavoritesQuery() {
	const { username } = useParams({ from: '/u/$username/favorites/' });

	return useInfiniteQuery(
		orpc.favorites.listByUsername.infiniteOptions({
			input: (page) => ({
				username,
				page: page ?? 1,
				pageSize: 10,
			}),
			initialPageParam: 1,
			getNextPageParam: (lastPage) => {
				if (!lastPage.pagination.hasNext) {
					return null;
				}
				return lastPage.pagination.page + 1;
			},
			pageParamName: 'page',
			retry: false,
			enabled: username !== null,
		}),
	);
}
