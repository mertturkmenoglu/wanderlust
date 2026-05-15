import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useInvalidator } from '@/hooks/use-invalidator';
import { orpc } from '@/lib/orpc';

export function useTopPlacesQuery(username: string) {
	return useSuspenseQuery(
		orpc.users.listTopPlaces.queryOptions({
			input: {
				username,
			},
		}),
	);
}

export function useTopPlacesMutation() {
	const invalidate = useInvalidator();

	return useMutation(
		orpc.users.updateTopPlaces.mutationOptions({
			onSuccess: async () => {
				await invalidate();
				toast.success('Updated top places');
			},
		}),
	);
}
