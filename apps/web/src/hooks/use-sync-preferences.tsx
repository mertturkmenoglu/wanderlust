import { skipToken, useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { orpc } from '@/lib/orpc';
import { usePreferencesStore } from '@/stores/preferences-context';
import { useIsAuthenticated } from './use-is-authenticated';

export function useSyncPreferences() {
	const setPreferences = usePreferencesStore((s) => s.setPreferences);
	const isAuth = useIsAuthenticated();

	const query = useQuery(
		orpc.preferences.get.queryOptions({
			input: isAuth ? {} : skipToken,
			staleTime: 0,
		}),
	);

	// biome-ignore lint/correctness/useExhaustiveDependencies: setPreferences is intentionally omitted from the dependency array.
	useEffect(() => {
		if (query.data) {
			setPreferences(query.data.preferences);
		}
	}, [query.data]);
}
