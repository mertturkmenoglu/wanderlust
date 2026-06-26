import { useMutation } from '@tanstack/react-query';
import { useRouteContext } from '@tanstack/react-router';
import { toast } from 'sonner';
import { useInvalidator } from '@/hooks/use-invalidator';
import { orpc } from '@/lib/orpc';
import type { TComment } from './types';

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
