import { createFileRoute } from '@tanstack/react-router';
import { BackLink } from '@/components/back-link';
import { PlaceCard } from '@/components/place-card';
import { ReviewCard } from '@/components/review-card';

export const Route = createFileRoute('/p/$id/reviews/$reviewId/')({
	component: RouteComponent,
	loader: ({ params, context }) =>
		context.queryClient.ensureQueryData(
			context.orpc.reviews.get.queryOptions({
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
				href={`/p/${data.review.placeId}`}
				text="Go back to place details"
			/>
			<div className="">
				<PlaceCard place={data.review.place} variant="item" />
				<ReviewCard review={data.review} className="my-16" />
			</div>
		</div>
	);
}
