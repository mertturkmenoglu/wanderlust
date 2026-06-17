import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { useLoaderData } from '@tanstack/react-router';
import { toast } from 'sonner';
import { useInvalidator } from '@/hooks/use-invalidator';
import { useIsAuthenticated } from '@/hooks/use-is-authenticated';
import { orpc } from '@/lib/orpc';
import { useAddToListContext } from './context';

export function useCheckStatusQuery() {
	const isAuth = useIsAuthenticated();
	const ctx = useAddToListContext();
	const { place } = useLoaderData({ from: '/p/$id/' });

	return useSuspenseQuery(
		orpc.lists.checkStatus.queryOptions({
			input: {
				placeId: place.id,
			},
			enabled: !!isAuth && ctx.open,
		}),
	);
}

export function useAddToListMutation() {
	const ctx = useAddToListContext();
	const invalidate = useInvalidator();

	return useMutation(
		orpc.lists.appendItem.mutationOptions({
			onSuccess: async () => {
				await invalidate();
				toast.success('Added to the list');
				ctx.setOpen(false);
			},
		}),
	);
}
