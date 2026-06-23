import { useSuspenseQuery } from '@tanstack/react-query';
import { useLoaderData } from '@tanstack/react-router';
import { useMemo } from 'react';
import {
	searchTypesense,
	type TSearchCityHit,
	TypesenseQueryBuilder,
} from '@/lib/search';
import { usePreferencesStore } from '@/stores/preferences-context';

export function useNearbyCities() {
	const searchRadiusPreference = usePreferencesStore(
		(s) => s.preferences.searchRadius,
	);

	const radius = useMemo(() => {
		switch (searchRadiusPreference) {
			case 'close':
				return '250 km';
			case 'medium':
				return '400 km';
			case 'far':
				return '500 km';
			default:
				return '250 km';
		}
	}, [searchRadiusPreference]);

	const { place } = useLoaderData({ from: '/p/$id/' });
	const { lat, lng } = place.address.city;

	return useSuspenseQuery({
		queryKey: ['nearby-cities', place.address.cityId],
		queryFn: async () => {
			const query = new TypesenseQueryBuilder()
				.append('q', '*')
				.append('query_by', 'name')
				.append('filter_by', `location:(${lat},${lng},${radius})`)
				.build();

			return searchTypesense<TSearchCityHit>('cities', query);
		},
	});
}
