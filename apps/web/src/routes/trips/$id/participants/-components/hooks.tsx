import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useInvalidator } from '@/hooks/use-invalidator';
import { orpc } from '@/lib/orpc';

export function useRemoveParticipantMutation() {
	const invalidate = useInvalidator();

	return useMutation(
		orpc.trips.deleteParticipant.mutationOptions({
			onSuccess: async () => {
				await invalidate();
				toast.success('Participant removed');
			},
		}),
	);
}
