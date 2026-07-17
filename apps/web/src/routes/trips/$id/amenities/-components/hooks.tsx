import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { useLoaderData } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useInvalidator } from '@/hooks/use-invalidator';
import { orpc } from '@/lib/orpc';
import { updateTripAmenitiesSchema } from '@/schemas/update-trip-amenities';

export function useListAmenitiesQuery() {
	return useSuspenseQuery(
		orpc.amenities.list.queryOptions({
			input: {},
		}),
	);
}

export function useUpdateTripAmenitiesMutation() {
	const invalidate = useInvalidator();

	return useMutation(
		orpc.trips.update.mutationOptions({
			onSuccess: async () => {
				await invalidate();
				toast.success('Amenities updated successfully');
			},
		}),
	);
}

export function useUpdateTripAmenitiesForm() {
	const { trip } = useLoaderData({
		from: '/trips/$id',
	});

	return useForm({
		resolver: zodResolver(updateTripAmenitiesSchema),
		defaultValues: {
			amenities: trip.requestedAmenities,
		},
	});
}
