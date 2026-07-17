import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useInvalidator } from '@/hooks/use-invalidator';
import { type Outputs, orpc } from '@/lib/orpc';

export const listMyInvitesQueryOptions =
	orpc.trips.invites.listMine.queryOptions({
		input: {},
	});

export type TTripInvite =
	Outputs['trips']['invites']['listMine']['invites'][number];

export function useAcceptOrDeclineInviteMutation() {
	const invalidate = useInvalidator();

	return useMutation(
		orpc.trips.invites.respond.mutationOptions({
			onSuccess: async ({ accepted }) => {
				toast.success(accepted ? 'Invite accepted' : 'Invite declined');
				await invalidate();
			},
		}),
	);
}
