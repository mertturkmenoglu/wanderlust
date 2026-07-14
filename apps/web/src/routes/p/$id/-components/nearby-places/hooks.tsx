import { useSuspenseQuery } from '@tanstack/react-query';
import { useLoaderData } from '@tanstack/react-router';
import { useMemo, useState } from 'react';
import { SearchService, type TPlaceHit } from '@/lib/search';
import { usePreferencesStore } from '@/stores/preferences-context';

export function useNearbyPlaces() {
	const [search] = useState(() =>
		new SearchService<TPlaceHit>().getPlacesAdapter(),
	);

	const searchRadiusPreference = usePreferencesStore(
		(s) => s.preferences.searchRadius,
	);

	const radius = useMemo(() => {
		switch (searchRadiusPreference) {
			case 'close':
				return '50 km';
			case 'medium':
				return '100 km';
			case 'far':
				return '200 km';
			default:
				return '50 km';
		}
	}, [searchRadiusPreference]);

	const { place } = useLoaderData({ from: '/p/$id/' });
	const { lat, lng } = place;

	return useSuspenseQuery({
		queryKey: ['nearby-places', place.id],
		queryFn: async () => {
			return search.typesenseClient
				.collections<TPlaceHit>('places')
				.documents()
				.search(
					{
						filter_by: `location:(${lat},${lng},${radius}) && place.id:!=[${place.id}]`,
						q: '*',
						sort_by: `location(${lat},${lng}):asc`,
					},
					{},
				);
		},
	});
}
