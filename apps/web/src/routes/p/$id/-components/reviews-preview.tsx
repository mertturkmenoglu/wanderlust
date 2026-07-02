import { useSuspenseQuery } from '@tanstack/react-query';
import { Link, useParams } from '@tanstack/react-router';
import { buttonVariants } from '@wanderlust/ui/components/button';
import { ChevronRightIcon } from 'lucide-react';
import { ReviewCard } from '@/components/review-card';
import { SuspenseWrapper } from '@/components/suspense-wrapper';
import { orpc } from '@/lib/orpc';

export function ReviewsPreview() {
	return (
		<div>
			<SuspenseWrapper>
				<Content />
			</SuspenseWrapper>
		</div>
	);
}

function Content() {
	const params = useParams({ from: '/p/$id/' });
	const query = useSuspenseQuery(
		orpc.reviews.listByPlaceId.queryOptions({
			input: {
				id: params.id,
				page: 1,
				pageSize: 10,
			},
		}),
	);

	const reviews = query.data.reviews;

	return (
		<div>
			<div className="flex flex-row items-center justify-between gap-4">
				<h3 id="reviews" className="font-semibold text-xl tracking-tight">
					Latest Reviews
				</h3>

				<Link
					to="/p/$id/reviews"
					params={{
						id: params.id,
					}}
					className={buttonVariants({ variant: 'default' })}
				>
					<span>View all reviews</span>
					<ChevronRightIcon />
				</Link>
			</div>

			<div className="mt-4">
				{reviews.map((review) => (
					<ReviewCard key={review.id} review={review} />
				))}
			</div>
		</div>
	);
}
