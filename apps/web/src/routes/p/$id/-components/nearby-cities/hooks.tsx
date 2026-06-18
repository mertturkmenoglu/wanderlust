import { useSuspenseQuery } from '@tanstack/react-query';
import { useLoaderData } from '@tanstack/react-router';
import {
	searchTypesense,
	type TSearchCityHit,
	TypesenseQueryBuilder,
} from '@/lib/search';

export function useNearbyCities() {
	const { place } = useLoaderData({ from: '/p/$id/' });

	return useSuspenseQuery({
		queryKey: ['nearby-cities', place.address.cityId],
		queryFn: async () => {
			const query = new TypesenseQueryBuilder()
				.append('q', '*')
				.append('query_by', 'name')
				.append(
					'filter_by',
					`location:(${place.address.city.lat},${place.address.city.lng},250 km)`,
				)
				.build();

			return searchTypesense<TSearchCityHit>('cities', query);
		},
	});
}
