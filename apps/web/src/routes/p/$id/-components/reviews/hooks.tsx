import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { useLoaderData, useSearch } from '@tanstack/react-router';
import { type Outputs, orpc } from '@/lib/orpc';

type Review = Outputs['reviews']['listByPlaceId']['reviews'][number];

export function useAssetsQuery(placeId: string) {
	return useSuspenseQuery(
		orpc.reviews.listAssetsByPlaceId.queryOptions({
			input: {
				id: placeId,
			},
		}),
	);
}

export function useRatingsQuery(placeId: string) {
	return useQuery(
		orpc.reviews.getRatings.queryOptions({
			input: {
				id: placeId,
			},
		}),
	);
}

export const numFmt = Intl.NumberFormat('en-US', {
	style: 'decimal',
	compactDisplay: 'short',
	notation: 'compact',
});

export function useReviewsQuery() {
	const { place } = useLoaderData({ from: '/p/$id/' });
	const search = useSearch({ from: '/p/$id/' });

	return useQuery(
		orpc.reviews.listByPlaceId.queryOptions({
			input: {
				id: place.id,
				pageSize: 10,
				page: search.page ?? 1,
				maxRating: search.maxRating,
				minRating: search.minRating,
				sortBy: search.sortBy,
				sortOrd: search.sortOrd,
			},
		}),
	);
}

export function useSortedReviews() {
	const query = useReviewsQuery();
	const search = useSearch({ from: '/p/$id/' });

	if (!query.data) return [];

	const { reviews } = query.data;

	if (search.sortOrd === 'asc' && search.sortBy === 'created_at') {
		const sorted: Review[] = [];
		for (const v of reviews) {
			sorted.unshift(v);
		}
		return sorted;
	}

	if (search.sortBy === 'rating') {
		if (search.sortOrd === 'asc') {
			return reviews.sort((a, b) => a.rating - b.rating);
		}
		return reviews.sort((a, b) => b.rating - a.rating);
	}

	return reviews;
}
