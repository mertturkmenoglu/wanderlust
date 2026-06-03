import { useSuspenseQuery } from '@tanstack/react-query';
import { orpc } from '@/lib/orpc';
import type { PlaceCatalogAccessor } from './types';

export function useHomeAggregationsQuery() {
	return useSuspenseQuery(
		orpc.aggregator.home.queryOptions({
			input: {},
		}),
	);
}

export function useFeaturedCitiesQuery() {
	return useSuspenseQuery(
		orpc.cities.listFeatured.queryOptions({
			input: {},
		}),
	);
}

export function usePlaceCatalogTitle(type: PlaceCatalogAccessor) {
	if (type === 'new') return 'New Places';
	if (type === 'popular') return 'Popular Places';
	if (type === 'featured') return 'Featured Places';
	if (type === 'favorites') return 'Favorite Places';
	return '';
}
