import { ReviewCard } from '@/components/review-card';
import { EmptyState } from './empty';
import { ErrorState } from './error';
import { useReviewsQuery, useSortedReviews } from './hooks';
import { Loading } from './loading';
import { Pagination } from './pagination';

export function ReviewsList() {
	const query = useReviewsQuery();
	const sortedReviews = useSortedReviews();

	if (query.isLoading) {
		return <Loading />;
	}

	if (query.isError) {
		return <ErrorState />;
	}

	if (query.data && query.data.pagination.totalRecords === 0) {
		return <EmptyState />;
	}

	if (!query.data) {
		return null;
	}

	return (
		<>
			{sortedReviews.map((review) => (
				<ReviewCard review={review} key={review.id} />
			))}

			<div className="col-span-full mt-4 flex justify-center">
				<Pagination />
			</div>
		</>
	);
}
