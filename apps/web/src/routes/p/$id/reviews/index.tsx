import { createFileRoute } from '@tanstack/react-router';
import { BackLink } from '@/components/back-link';
import { SuspenseWrapper } from '@/components/suspense-wrapper';
import { orpc } from '@/lib/orpc';
import { listReviewsSchema } from '@/schemas/list-reviews';
import { Content } from './-components/content';

export const Route = createFileRoute('/p/$id/reviews/')({
	component: RouteComponent,
	validateSearch: listReviewsSchema,
	loaderDeps: ({ search }) => ({ search }),
	loader: async ({ context, params, deps }) => {
		context.queryClient.prefetchQuery(
			orpc.reviews.listByPlaceId.queryOptions({
				input: {
					id: params.id,
					page: deps.search.page ?? 1,
					pageSize: 10,
					maxRating: deps.search.maxRating,
					minRating: deps.search.minRating,
					sortBy: deps.search.sortBy,
					sortOrd: deps.search.sortOrd,
				},
			}),
		);

		context.queryClient.prefetchQuery(
			orpc.places.get.queryOptions({ input: { id: params.id } }),
		);

		context.queryClient.prefetchQuery(
			orpc.reviews.getRatings.queryOptions({
				input: {
					id: params.id,
				},
			}),
		);
	},
});

function RouteComponent() {
	const params = Route.useParams();

	return (
		<div className="mx-auto my-8 w-full max-w-7xl">
			<BackLink
				to="/p/$id"
				text="Back to place details"
				params={{
					id: params.id,
				}}
			/>

			<SuspenseWrapper>
				<Content />
			</SuspenseWrapper>
		</div>
	);
}
