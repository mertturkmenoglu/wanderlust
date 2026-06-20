import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { TripPlannerBanner } from '@/components/banner/common';
import { Collection } from '@/components/collection';
import { ErrorComponent } from '@/components/error-component';
import { useInterleaveRenderer } from '@/components/interleave-renderer';
import { SuspenseWrapper } from '@/components/suspense-wrapper';
import { TagNavigation } from '@/components/tag-navigation';
import { orpc } from '@/lib/orpc';
import { CityBreadcrumb } from './-city-breadcrumb';
import { CitySearchBanner } from './-city-search-banner';
import { Description } from './-description';
import { CityListBanner } from './-list-banner';
import { MapComponent } from './-map';
import { PlanTripBanner } from './-plan-trip-banner';

export const Route = createFileRoute('/cities/$/')({
	component: RouteComponent,
	loader: ({ context, params }) => {
		const slug = params._splat;

		if (!slug) {
			throw new Response('Slug is missing', { status: 404 });
		}

		const cityId = slug.split('/')[0];

		if (!cityId) {
			throw new Response('City ID is missing', { status: 404 });
		}

		return context.queryClient.ensureQueryData(
			context.orpc.cities.get.queryOptions({
				input: {
					id: +cityId,
				},
			}),
		);
	},
	errorComponent: ErrorComponent,
});

function RouteComponent() {
	const { city } = Route.useLoaderData();
	const query = useSuspenseQuery(
		orpc.collections.listByCityId.queryOptions({ input: { cityId: city.id } }),
	);
	const ilr = useInterleaveRenderer();

	return (
		<SuspenseWrapper>
			<div className="mx-auto w-full max-w-7xl py-8">
				<CityBreadcrumb />

				<Description />

				<MapComponent />

				<div className="mt-8">
					<h3 className="mb-8 text-lg md:text-2xl">Discover {city.name}</h3>{' '}
					<TagNavigation cityName={city.name} />
				</div>

				<ilr.Renderer
					listA={[
						<PlanTripBanner />,
						<CitySearchBanner />,
						...ilr.skip(1),
						<TripPlannerBanner classNames={{ root: 'mt-8' }} />,
						...ilr.skip(3),
						<CityListBanner />,
					]}
					listB={query.data.collections.map((c) => (
						<Collection key={c.id} collection={c} className="mt-8" />
					))}
				/>
			</div>
		</SuspenseWrapper>
	);
}
