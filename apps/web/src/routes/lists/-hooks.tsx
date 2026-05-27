import { useInfiniteQuery } from '@tanstack/react-query';
import { type Outputs, orpc } from '@/lib/orpc';

export type TList = Outputs['lists']['listAll']['lists'][number];

export function useListsQuery() {
	return useInfiniteQuery(
		orpc.lists.listAll.infiniteOptions({
			input: (p) => ({
				page: p,
				pageSize: 10,
			}),
			initialPageParam: 1,
			getNextPageParam: ({ pagination }) =>
				!pagination.hasNext ? null : pagination.page + 1,
			retry: false,
		}),
	);
}
