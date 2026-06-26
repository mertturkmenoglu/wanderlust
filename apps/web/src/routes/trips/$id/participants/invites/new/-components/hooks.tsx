import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useInvalidator } from '@/hooks/use-invalidator';
import { orpc } from '@/lib/orpc';
import { useTripCreateInviteContext } from './context';

export function useSearchFollowingQuery() {
	const ctx = useTripCreateInviteContext();

	return useSuspenseQuery(
		orpc.users.searchFollowing.queryOptions({
			input: {
				username: ctx.debounced,
			},
			enabled: ctx.isQueryEnabled,
		}),
	);
}

export function useCreateInviteMutation() {
	const invalidate = useInvalidator();

	return useMutation(
		orpc.trips.createInvite.mutationOptions({
			onSuccess: async () => {
				await invalidate();
				toast.success('Invite sent successfully');
			},
		}),
	);
}
