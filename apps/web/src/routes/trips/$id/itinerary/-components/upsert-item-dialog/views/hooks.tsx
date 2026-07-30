import { useMutation } from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';
import { toast } from 'sonner';
import { useInvalidator } from '@/hooks/use-invalidator';
import { orpc } from '@/lib/orpc';
import { useItineraryContext } from '../hooks';

export function useTripId() {
	const params = useParams({ from: '/trips/$id/itinerary/' });
	return params.id;
}

export function useCreateItineraryItemMutation() {
	const ctx = useItineraryContext();
	const invalidate = useInvalidator();

	return useMutation(
		orpc.trips.itinerary.create.mutationOptions({
			onSuccess: async () => {
				await invalidate();
				toast.success('Itinerary item created');
				ctx.setOpen(false);
			},
		}),
	);
}

export function useUpdateItineraryItemMutation() {
	const ctx = useItineraryContext();
	const invalidate = useInvalidator();

	return useMutation(
		orpc.trips.itinerary.update.mutationOptions({
			onSuccess: async () => {
				await invalidate();
				toast.success('Itinerary item updated');
				ctx.setOpen(false);
			},
		}),
	);
}
