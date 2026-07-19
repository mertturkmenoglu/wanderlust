import {
	skipToken,
	useMutation,
	useQuery,
	useQueryClient,
} from '@tanstack/react-query';
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

export function useLikeReviewMutation() {
	const invalidate = useInvalidator();

	return useMutation(
		orpc.reviews.like.mutationOptions({
			onSuccess: async () => {
				await invalidate();
			},
		}),
	);
}

const languageDisplayNames = new Intl.DisplayNames(['en'], {
	type: 'language',
});

export function useDetectedLanguage(langCode: string | null) {
	if (langCode === null) {
		return null;
	}

	return languageDisplayNames.of(langCode) ?? null;
}

export function useUserDetails(open: boolean, username: string) {
	return useQuery(
		orpc.users.get.queryOptions({
			input: open
				? {
						username: username,
					}
				: skipToken,
			staleTime: 5 * 60 * 1000, // avoid refetching every hover
		}),
	);
}
