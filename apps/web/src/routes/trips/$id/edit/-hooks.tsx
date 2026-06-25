import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useLoaderData, useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useInvalidator } from '@/hooks/use-invalidator';
import { orpc } from '@/lib/orpc';
import { updateTripSchema } from '@/schemas/create-trip';

export function useUpdateTripForm() {
	const { trip } = useLoaderData({ from: '/trips/$id' });

	return useForm({
		resolver: zodResolver(updateTripSchema),
		defaultValues: {
			title: trip.title,
			description: trip.description,
			visibilityLevel: trip.visibilityLevel,
			startAt: trip.startAt,
			endAt: trip.endAt,
		},
	});
}

export function useUpdateTripMutation() {
	const invalidate = useInvalidator();

	return useMutation(
		orpc.trips.update.mutationOptions({
			onSuccess: async () => {
				await invalidate();
				toast.success('Trip updated');
			},
		}),
	);
}

export function useDeleteTripMutation() {
	const navigate = useNavigate({ from: '/trips/$id/edit/' });
	const invalidate = useInvalidator();

	return useMutation(
		orpc.trips.delete.mutationOptions({
			onSuccess: async () => {
				await navigate({
					to: '/trips',
				});
				toast.success('Trip deleted');
				await invalidate();
			},
		}),
	);
}
