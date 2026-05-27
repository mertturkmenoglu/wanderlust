import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import {
	useNavigate,
	useParams,
	useRouteContext,
} from '@tanstack/react-router';
import { toast } from 'sonner';
import { useInvalidator } from '@/hooks/use-invalidator';
import { orpc } from '@/lib/orpc';

export function useListQuery() {
	const params = useParams({ from: '/lists/$id/' });

	return useSuspenseQuery(
		orpc.lists.get.queryOptions({
			input: {
				id: params.id,
			},
		}),
	);
}

export function useDeleteMutation() {
	const invalidate = useInvalidator();
	const navigate = useNavigate();

	return useMutation(
		orpc.lists.delete.mutationOptions({
			onSuccess: async () => {
				await invalidate();
				toast.success('List is deleted.');
				navigate({
					to: '/lists',
				});
			},
		}),
	);
}

export function useIsOwner() {
	const query = useListQuery();
	const data = query.data;
	const ctx = useRouteContext({ from: '/lists/$id/' });
	return ctx.auth.user.id === data.list.userId;
}
