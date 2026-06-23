import { useMutation, useQueryClient } from '@tanstack/react-query';
import { orpc } from '@/lib/orpc';
import { usePreferencesStore } from '@/stores/preferences-context';

export function useUpdatePreferences() {
	const setPreferences = usePreferencesStore((s) => s.setPreferences);
	const qc = useQueryClient();

	return useMutation(
		orpc.preferences.update.mutationOptions({
			onSuccess: (data) => {
				setPreferences(data.preferences); // update local store immediately
				qc.setQueryData(orpc.preferences.get.queryKey({ input: {} }), data); // keep cache in sync
			},
		}),
	);
}
