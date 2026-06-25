import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useInvalidator } from '@/hooks/use-invalidator';
import { type Outputs, orpc } from '@/lib/orpc';

export const listMyInvitesQueryOptions = orpc.trips.listMyInvites.queryOptions({
	input: {},
});

export type TTripInvite = Outputs['trips']['listMyInvites']['invites'][number];

export function useAcceptOrDeclineInviteMutation() {
	const invalidate = useInvalidator();

	return useMutation(
		orpc.trips.acceptOrDeclineInvite.mutationOptions({
			onSuccess: async ({ accepted }) => {
				toast.success(accepted ? 'Invite accepted' : 'Invite declined');
				await invalidate();
			},
		}),
	);
}
