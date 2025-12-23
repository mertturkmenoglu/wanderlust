import { useSuspenseQuery } from '@tanstack/react-query';
import { useSearch } from '@tanstack/react-router';
import { orpc } from '@/lib/orpc';

export function useBookmarksQuery() {
	const { page, pageSize } = useSearch({
		from: '/bookmarks/',
	});

	return useSuspenseQuery(
		orpc.bookmarks.list.queryOptions({
			input: {
				page,
				pageSize,
			},
			retry: false,
		}),
	);
}
