import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useInvalidator } from '@/hooks/use-invalidator';
import { orpc } from '@/lib/orpc';
import { schema } from './schema';

export function useCreateTripForm() {
	return useForm({
		resolver: zodResolver(schema),
	});
}

export function useCreateTripMutation() {
	const invalidate = useInvalidator();
	const navigate = useNavigate();

	return useMutation(
		orpc.trips.create.mutationOptions({
			onSuccess: async (res) => {
				await invalidate();
				await navigate({
					to: '/trips/$id',
					params: {
						id: res.trip.id,
					},
				});
				toast.success('Trip created');
			},
		}),
	);
}
