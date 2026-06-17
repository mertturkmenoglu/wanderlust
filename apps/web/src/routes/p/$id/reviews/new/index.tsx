import { createFileRoute } from '@tanstack/react-router';
import { FormProvider } from 'react-hook-form';
import { BackLink } from '@/components/back-link';
import { PlaceCard } from '@/components/place-card';
import { useIsMobile } from '@/hooks/use-mobile';
import { authGuard } from '@/lib/auth';
import { Content } from './-content';
import { CreateReviewContextProvider } from './-context';
import { useCreateReviewForm } from './-hooks';

export const Route = createFileRoute('/p/$id/reviews/new/')({
	component: RouteComponent,
	beforeLoad: authGuard,
	loader: ({ params, context }) =>
		context.queryClient.ensureQueryData(
			context.orpc.places.get.queryOptions({
				input: {
					id: params.id,
				},
			}),
		),
});

function RouteComponent() {
	const data = Route.useLoaderData();
	const form = useCreateReviewForm();
	const isMobile = useIsMobile();

	return (
		<div className="mx-auto my-8 w-full max-w-7xl">
			<BackLink
				to="/p/$id"
				params={{ id: data.place.id }}
				text="Back to place details"
			/>

			<div className="my-8 grid grid-cols-1 gap-8 md:grid-cols-3">
				<PlaceCard
					place={data.place}
					variant={isMobile ? 'item' : 'default'}
					className="col-span-1 max-h-min md:col-span-1"
				/>

				<div className="col-span-2 flex flex-col md:col-span-2">
					<CreateReviewContextProvider>
						<FormProvider {...form}>
							<Content />
						</FormProvider>
					</CreateReviewContextProvider>
				</div>
			</div>
		</div>
	);
}
