import { useInfiniteQuery } from '@tanstack/react-query';
import { orpc } from '@/lib/orpc';

export function useMyTripsQuery() {
	return useInfiniteQuery(
		orpc.trips.list.infiniteOptions({
			input: (page) => ({
				page,
				pageSize: 10,
			}),
			initialPageParam: 1,
			getNextPageParam: (last) =>
				last.pagination.hasNext ? last.pagination.page + 1 : undefined,
		}),
	);
}
