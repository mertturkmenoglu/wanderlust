import { Pagination } from '@/components/pagination';
import { ReviewCard } from '@/components/review-card';
import { EmptyState } from './empty';
import { useReviewsQuery } from './hooks';

export function Main() {
	const query = useReviewsQuery();
	const reviews = query.data.reviews;
	const pagination = query.data.pagination;

	const isEmpty = reviews.length === 0;

	if (isEmpty) {
		return <EmptyState />;
	}

	return (
		<section className="flex flex-col items-center gap-8">
			<div>
				{reviews.map((review) => (
					<ReviewCard key={review.id} review={review} />
				))}
			</div>

			<Pagination pagination={pagination} />
		</section>
	);
}
