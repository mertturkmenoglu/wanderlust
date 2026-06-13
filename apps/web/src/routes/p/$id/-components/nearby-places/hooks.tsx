import { useSuspenseQuery } from '@tanstack/react-query';
import { useLoaderData } from '@tanstack/react-router';
import { env } from '@/lib/env';
import type { SearchResponse } from './types';

const searchApiKey = env.VITE_SEARCH_CLIENT_API_KEY;
const searchApiUrl = env.VITE_SEARCH_CLIENT_URL;
const headers = {
	'X-TYPESENSE-API-KEY': searchApiKey,
};

export function useNearbyPlaces() {
	const { place } = useLoaderData({ from: '/p/$id/' });

	return useSuspenseQuery({
		queryKey: ['place-nearby', place.id],
		queryFn: async () => {
			const sp = new URLSearchParams();
			sp.append('q', '*');
			sp.append('query_by', 'name');
			sp.append(
				'filter_by',
				`location:(${place.address.lat},${place.address.lng},50 km)`,
			);
			const url = `${searchApiUrl}/collections/places/documents/search?${sp.toString()}`;
			const res = await fetch(url, {
				headers,
			});
			const data = (await res.json()) as SearchResponse;
			return data;
		},
	});
}
