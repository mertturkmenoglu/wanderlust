import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useInvalidator } from '@/hooks/use-invalidator';
import { type Outputs, orpc } from '@/lib/orpc';

type Participant = Outputs['trips']['get']['trip']['participants'][number];

export type TripParticipant = Omit<Participant, 'role'> & {
	role: 'owner' | 'editor' | 'member';
};

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
