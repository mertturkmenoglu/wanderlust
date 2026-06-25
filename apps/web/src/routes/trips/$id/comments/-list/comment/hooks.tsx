import { useMutation } from '@tanstack/react-query';
import { useLoaderData, useRouteContext } from '@tanstack/react-router';
import { toast } from 'sonner';
import { useInvalidator } from '@/hooks/use-invalidator';
import { useTripIsPrivileged } from '@/hooks/use-trip-is-privileged';
import { orpc } from '@/lib/orpc';
import type { TComment } from './types';

export function useIsPrivilegedStatus() {
	const { trip } = useLoaderData({ from: '/trips/$id' });
	const { auth } = useRouteContext({ from: '/trips/$id' });
	return useTripIsPrivileged(trip, auth.user?.id ?? '');
}

export function useDeleteCommentMutation() {
	const invalidate = useInvalidator();

	return useMutation(
		orpc.trips.deleteComment.mutationOptions({
			onSuccess: async () => {
				await invalidate();
				toast.success('Comment removed');
			},
		}),
	);
}

export function useUpdateCommentMutation() {
	const invalidate = useInvalidator();

	return useMutation(
		orpc.trips.updateComment.mutationOptions({
			onSuccess: async () => {
				await invalidate();
				toast.success('Comment updated');
			},
		}),
	);
}

export function useIsCommentOwner(comment: TComment) {
	const { auth } = useRouteContext({ from: '/trips/$id' });
	return comment.userId === auth.user.id;
}
