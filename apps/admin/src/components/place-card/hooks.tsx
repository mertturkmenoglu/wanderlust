import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useInvalidator } from '@/hooks/use-invalidator';
import { orpc } from '@/lib/orpc';

export function useAddToFavoritesMutation() {
	const invalidate = useInvalidator();

	return useMutation(
		orpc.favorites.create.mutationOptions({
			onSuccess: async () => {
				await invalidate();
				toast.success('Added to favorites');
			},
		}),
	);
}

export function useRemoveFromFavoritesMutation() {
	const invalidate = useInvalidator();

	return useMutation(
		orpc.favorites.delete.mutationOptions({
			onSuccess: async () => {
				await invalidate();
				toast.success('Removed from favorites');
			},
		}),
	);
}
