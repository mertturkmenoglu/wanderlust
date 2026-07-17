import { skipToken, useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useInvalidator } from '@/hooks/use-invalidator';
import { orpc } from '@/lib/orpc';
import { useUpsertLocationDialogContext } from './context';

export function usePlaceQuery() {
	const ctx = useUpsertLocationDialogContext();

	return useQuery(
		orpc.places.get.queryOptions({
			input: ctx.placeId ? { id: ctx.placeId } : skipToken,
			retry: false,
		}),
	);
}

export function useCloseDialog() {
	const ctx = useUpsertLocationDialogContext();
	const navigate = useNavigate({ from: '/trips/$id/details/' });

	return () => {
		ctx.setDescription('');
		ctx.setScheduledTime(new Date());
		navigate({
			to: '.',
			search: () => ({}),
		});
	};
}

export function useOpenDialog() {
	const ctx = useUpsertLocationDialogContext();
	const navigate = useNavigate({ from: '/trips/$id/details/' });

	return () => {
		if (ctx.onOpen) {
			ctx.onOpen();
			return;
		}

		navigate({
			to: '.',
			search: () => ({ dialog: true }),
		});
	};
}

export function useCreateLocationMutation() {
	const invalidate = useInvalidator();
	const close = useCloseDialog();

	return useMutation(
		orpc.trips.locations.create.mutationOptions({
			onSuccess: async () => {
				await invalidate();
				close();
			},
		}),
	);
}

export function useUpdateLocationMutation() {
	const invalidate = useInvalidator();
	const close = useCloseDialog();

	return useMutation(
		orpc.trips.locations.update.mutationOptions({
			onSuccess: async () => {
				await invalidate();
				close();
			},
		}),
	);
}

export function useDeleteLocationMutation() {
	const invalidate = useInvalidator();
	const close = useCloseDialog();

	return useMutation(
		orpc.trips.locations.delete.mutationOptions({
			onSuccess: async () => {
				await invalidate();
				close();
			},
		}),
	);
}

export function useDialogTitle() {
	const ctx = useUpsertLocationDialogContext();

	return ctx.update ? 'Update location' : 'Add location to trip';
}
