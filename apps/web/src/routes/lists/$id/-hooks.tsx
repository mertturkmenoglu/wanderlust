import { useMutation } from '@tanstack/react-query';
import {
	useLoaderData,
	useNavigate,
	useRouteContext,
} from '@tanstack/react-router';
import { toast } from 'sonner';
import { useInvalidator } from '@/hooks/use-invalidator';
import { orpc } from '@/lib/orpc';

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
	const data = useLoaderData({ from: '/lists/$id/' });
	const ctx = useRouteContext({ from: '/lists/$id/' });
	return ctx.auth.user.id === data.list.userId;
}
