import { useMutation, useQuery } from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';
import { toast } from 'sonner';
import { useInvalidator } from '@/hooks/use-invalidator';
import { type Outputs, orpc } from '@/lib/orpc';

export type Invite = Outputs['trips']['listInvites']['invites'][number];

export function useListInvitesQuery() {
	const { id } = useParams({ from: '/trips/$id' });

	return useQuery(
		orpc.trips.listInvites.queryOptions({
			input: {
				id,
			},
		}),
	);
}

export function useDeleteInviteMutation() {
	const invalidate = useInvalidator();

	return useMutation(
		orpc.trips.deleteInvite.mutationOptions({
			onSuccess: async () => {
				await invalidate();
				toast.success('Invite removed');
			},
		}),
	);
}
