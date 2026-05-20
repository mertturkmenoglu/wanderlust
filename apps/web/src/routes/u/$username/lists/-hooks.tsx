import { useInfiniteQuery } from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';
import { orpc } from '@/lib/orpc';

export function usePublicListsQuery() {
	const { username } = useParams({ from: '/u/$username/lists/' });
	return useInfiniteQuery(
		orpc.lists.listPublic.infiniteOptions({
			input: (page) => ({
				username,
				page,
				pageSize: 10,
			}),
			initialPageParam: 1,
			getNextPageParam: (lastPage) =>
				lastPage.pagination.hasNext ? lastPage.pagination.page + 1 : undefined,
			retry: false,
			enabled: username !== '',
		}),
	);
}
