import { useLoaderData } from '@tanstack/react-router';
import { useEffect } from 'react';
import z from 'zod';
import { useLocalStorage } from '@/hooks/use-localstorage';
import { usePreferencesStore } from '@/stores/preferences-context';

const key = 'wl-recent-views';

const schema = z.object({
	id: z.string(),
	name: z.string(),
	image: z.url(),
});

type TRecentView = z.infer<typeof schema>;

export function useTrackRecentViews() {
	const isRecentViewsEnabled = usePreferencesStore(
		(s) => s.preferences.enableRecentViews,
	);

	const [_values, setValues, clearValues] = useLocalStorage<TRecentView[]>(
		key,
		[],
		{
			deserializer: (str) => {
				try {
					const parsed = JSON.parse(str);
					const validated = z.array(schema).parse(parsed);
					return validated;
				} catch {}

				return [];
			},
		},
	);

	const { place } = useLoaderData({ from: '/p/$id/' });

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
