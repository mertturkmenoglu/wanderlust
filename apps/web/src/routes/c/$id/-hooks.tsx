import { useSuspenseQuery } from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';
import { orpc } from '@/lib/orpc';

export function useCollectionQuery() {
	const { id } = useParams({ from: '/c/$id/' });

	return useSuspenseQuery(
		orpc.collections.get.queryOptions({
			input: {
				id,
			},
		}),
	);
}
