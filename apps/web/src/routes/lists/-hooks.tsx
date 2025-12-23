import { useInfiniteQuery } from '@tanstack/react-query';
import { orpc } from '@/lib/orpc';

export function useListsQuery() {
	return useInfiniteQuery(
		orpc.lists.listAll.infiniteOptions({
			input: (p) => ({
				page: p,
				pageSize: 10,
			}),
			initialPageParam: 1,
			getNextPageParam: (lastPage) => {
				if (!lastPage.pagination.hasNext) {
					return null;
				}
				return lastPage.pagination.page + 1;
			},
			retry: false,
		}),
	);
}
