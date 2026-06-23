import { useSuspenseQuery } from '@tanstack/react-query';
import { useLoaderData } from '@tanstack/react-router';
import { useMemo } from 'react';
import {
	searchTypesense,
	type TSearchHit,
	TypesenseQueryBuilder,
} from '@/lib/search';
import { usePreferencesStore } from '@/stores/preferences-context';

export function useNearbyPlaces() {
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
	const { lat, lng } = place.address;

	return useSuspenseQuery({
		queryKey: ['nearby-places', place.id],
		queryFn: async () => {
			const query = new TypesenseQueryBuilder()
				.append('q', '*')
				.append('query_by', 'name')
				.append('filter_by', `location:(${lat},${lng},${radius})`)
				.build();

			return searchTypesense<TSearchHit>('places', query);
		},
	});
}
