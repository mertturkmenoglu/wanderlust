import { useSuspenseQuery } from '@tanstack/react-query';
import { useParams, useSearch } from '@tanstack/react-router';
import { type Outputs, orpc } from '@/lib/orpc';

export type Review = Outputs['reviews']['listByPlaceId']['reviews'][number];

export function useReviewsQuery() {
	const params = useParams({ from: '/p/$id/reviews/' });
	const search = useSearch({ from: '/p/$id/reviews/' });

	return useSuspenseQuery(
		orpc.reviews.listByPlaceId.queryOptions({
			input: {
				id: params.id,
				page: search.page ?? 1,
				pageSize: 10,
				maxRating: search.maxRating,
				minRating: search.minRating,
				sortBy: search.sortBy,
				sortOrd: search.sortOrd,
			},
		}),
	);
}

export function usePlaceQuery() {
	const params = useParams({ from: '/p/$id/reviews/' });

	return useSuspenseQuery(
		orpc.places.get.queryOptions({ input: { id: params.id } }),
	);
}

export function useRatingsQuery() {
	const params = useParams({ from: '/p/$id/reviews/' });

	return useSuspenseQuery(
		orpc.reviews.getRatings.queryOptions({
			input: {
				id: params.id,
			},
		}),
	);
}

export function useSortedReviews() {
	const query = useReviewsQuery();
	const search = useSearch({ from: '/p/$id/reviews/' });

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
			return reviews.sort((a, b) => a.review.rating - b.review.rating);
		}
		return reviews.sort((a, b) => b.review.rating - a.review.rating);
	}

	return reviews;
}
