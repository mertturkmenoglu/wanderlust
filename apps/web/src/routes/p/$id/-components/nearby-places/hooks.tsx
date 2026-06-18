import { useSuspenseQuery } from '@tanstack/react-query';
import { useLoaderData } from '@tanstack/react-router';
import {
	searchTypesense,
	type TSearchHit,
	TypesenseQueryBuilder,
} from '@/lib/search';

export function useNearbyPlaces() {
	const { place } = useLoaderData({ from: '/p/$id/' });

	return useSuspenseQuery({
		queryKey: ['place-nearby', place.id],
		queryFn: async () => {
			const query = new TypesenseQueryBuilder()
				.append('q', '*')
				.append('query_by', 'name')
				.append(
					'filter_by',
					`location:(${place.address.lat},${place.address.lng},50 km)`,
				)
				.build();

			return searchTypesense<TSearchHit>('places', query);
		},
	});
}
