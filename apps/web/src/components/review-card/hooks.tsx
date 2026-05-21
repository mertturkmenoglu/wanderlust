import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';
import { useInvalidator } from '@/hooks/use-invalidator';
import { orpc } from '@/lib/orpc';

export function useDeleteReviewMutation(placeId: string) {
	const navigate = useNavigate();
	const qc = useQueryClient();
	const invalidate = useInvalidator();

	return useMutation(
		orpc.reviews.delete.mutationOptions({
			onSuccess: async (_data, vars) => {
				qc.removeQueries({
					queryKey: orpc.reviews.get.queryKey({
						input: {
							id: vars.id,
						},
					}),
				});

				await navigate({
					to: '/p/$id',
					params: { id: placeId },
				});

				await invalidate();

				toast.success('Review deleted');
			},
		}),
	);
}
