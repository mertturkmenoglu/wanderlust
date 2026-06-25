import { useSuspenseQuery } from '@tanstack/react-query';
import { useLoaderData } from '@tanstack/react-router';
import { orpc } from '@/lib/orpc';
import { useCommentListContext } from './context';

export function useCommentsQuery() {
	const ctx = useCommentListContext();

	const { trip } = useLoaderData({ from: '/trips/$id' });

	return useSuspenseQuery(
		orpc.trips.listComments.queryOptions({
			input: {
				id: trip.id,
				page: ctx.page,
				pageSize: 10,
			},
		}),
	);
}
