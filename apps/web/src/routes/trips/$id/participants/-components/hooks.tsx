import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useInvalidator } from '@/hooks/use-invalidator';
import { orpc } from '@/lib/orpc';

export function useRemoveParticipantMutation() {
	const invalidate = useInvalidator();

	return useMutation(
		orpc.trips.participants.delete.mutationOptions({
			onSuccess: async () => {
				await invalidate();
				toast.success('Participant removed');
			},
		}),
	);
}
