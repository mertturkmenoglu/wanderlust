import { useSuspenseQuery } from '@tanstack/react-query';
import { useLoaderData } from '@tanstack/react-router';
import { useMemo, useState } from 'react';
import { SearchService, type TCityHit } from '@/lib/search';
import { usePreferencesStore } from '@/stores/preferences-context';

export function useNearbyCities() {
	const [search] = useState(() =>
		new SearchService<TCityHit>().getPlacesAdapter(),
	);

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
			return search.typesenseClient
				.collections<TCityHit>('cities')
				.documents()
				.search(
					{
						filter_by: `location:(${lat},${lng},${radius}) && city.id:!=[${place.address.cityId}]`,
						q: '*',
						sort_by: `location(${lat},${lng}):asc`,
					},
					{},
				);
		},
	});
}
