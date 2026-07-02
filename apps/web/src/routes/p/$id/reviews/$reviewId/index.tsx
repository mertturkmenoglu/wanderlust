import { createFileRoute } from '@tanstack/react-router';
import { BackLink } from '@/components/back-link';
import { CategoriesBanner, TripPlannerCta } from '@/components/banner/common';
import { ReviewCard } from '@/components/review-card';
import { SuspenseWrapper } from '@/components/suspense-wrapper';
import { orpc } from '@/lib/orpc';
import { Likes } from './-likes';

export const Route = createFileRoute('/p/$id/reviews/$reviewId/')({
	component: RouteComponent,
	loader: ({ params, context }) =>
		context.queryClient.ensureQueryData(
			orpc.reviews.get.queryOptions({
				input: {
					id: params.reviewId,
				},
			}),
		),
});

function RouteComponent() {
	const data = Route.useLoaderData();

	return (
		<div className="mx-auto my-8 w-full max-w-7xl">
			<BackLink
				to="/p/$id/reviews"
				params={{
					id: data.review.placeId,
				}}
				text="Go back to reviews"
			/>

			<div className="mx-auto my-16 max-w-3xl">
				<ReviewCard review={data} />

				<SuspenseWrapper>
					<Likes />
				</SuspenseWrapper>
			</div>

			<CategoriesBanner />

			<TripPlannerCta
				classNames={{
					root: 'my-8',
				}}
			/>
		</div>
	);
}
