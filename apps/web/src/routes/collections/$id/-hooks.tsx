import { useSuspenseQuery } from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';
import { orpc } from '@/lib/orpc';

export function useCollectionQuery() {
	const { id } = useParams({ from: '/collections/$id/' });

	return useSuspenseQuery(
		orpc.collections.get.queryOptions({
			input: {
				id,
			},
		}),
	);
}
