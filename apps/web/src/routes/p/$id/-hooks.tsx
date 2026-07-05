import { useLoaderData } from '@tanstack/react-router';
import { useEffect } from 'react';
import { type TRecentView, useRecentViews } from '@/hooks/use-recent-views';
import { usePreferencesStore } from '@/stores/preferences-context';

export function useTrackRecentViews() {
	const isRecentViewsEnabled = usePreferencesStore(
		(s) => s.preferences.enableRecentViews,
	);

	const [, setValues, clearValues] = useRecentViews();

	const { place } = useLoaderData({ from: '/p/$id/' });

	// biome-ignore lint/correctness/useExhaustiveDependencies: setValues is intentionally omitted from the dependency array.
	useEffect(() => {
		if (!isRecentViewsEnabled) {
			clearValues();
			return;
		}

		setValues((prev) => {
			const newValue: TRecentView = {
				id: place.id,
				name: place.name,
				image: place.assets[0]?.url ?? '',
			};

			const filtered = prev.filter((v) => v.id !== newValue.id);

			return [newValue, ...filtered].slice(0, 10);
		});
	}, [isRecentViewsEnabled, place]);
}
