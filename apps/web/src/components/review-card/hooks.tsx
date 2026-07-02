import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';
import { useInvalidator } from '@/hooks/use-invalidator';
import { useNumberFormatter } from '@/hooks/use-number-formatter';
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

export function useLikeReviewMutation() {
	const invalidate = useInvalidator();

	return useMutation(
		orpc.reviews.like.mutationOptions({
			onSuccess: async (v) => {
				await invalidate();

				toast.success(v.liked ? 'Review liked' : 'Review unliked');
			},
		}),
	);
}

export function useLikesFormatter() {
	const numFmt = useNumberFormatter();
	const pluralRules = new Intl.PluralRules('en-US');

	return (likes: number) => {
		const formattedLikes = numFmt.format(likes);
		const pluralCategory = pluralRules.select(likes);

		if (pluralCategory === 'one') {
			return `${formattedLikes} like`;
		}

		return `${formattedLikes} likes`;
	};
}
