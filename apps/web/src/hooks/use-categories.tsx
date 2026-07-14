import { useQuery } from '@tanstack/react-query';
import { orpc } from '@/lib/orpc';

export function useCategoriesQuery() {
	return useQuery(
		orpc.categories.list.queryOptions({
			input: {},
			staleTime: 1000 * 60 * 60, // 1 hour
		}),
	);
}
