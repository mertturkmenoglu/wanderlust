import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { lazy } from 'react';
import { TripPlannerBanner } from '@/components/banner/common';
import { Collection } from '@/components/collection';
import { ErrorComponent } from '@/components/error-component';
import { useInterleaveRenderer } from '@/components/interleave-renderer';
import { SuspenseWrapper } from '@/components/suspense-wrapper';
import { TagNavigation } from '@/components/tag-navigation';
import { orpc } from '@/lib/orpc';
import { seo } from '@/lib/seo';
import { CityBreadcrumb } from './-city-breadcrumb';
import { CitySearchBanner } from './-city-search-banner';
import { Description } from './-description';
import { getCityIdFromParams } from './-hooks';
import { CityListBanner } from './-list-banner';
import { PlanTripBanner } from './-plan-trip-banner';

const MapComponent = lazy(() =>
	import('./-map').then((mod) => ({ default: mod.MapComponent })),
);

export const Route = createFileRoute('/cities/$/')({
	component: RouteComponent,
	loader: ({ context, params }) => {
		const id = getCityIdFromParams(params._splat);

		return context.queryClient.ensureQueryData(
			orpc.cities.get.queryOptions({
				input: {
					id,
				},
			}),
		);
	},
	head: ({ loaderData }) => {
		if (!loaderData) {
			return {
				title: 'City Not Found',
				meta: [
					{
						name: 'description',
						content: 'City not found',
					},
				],
			};
		}

		const city = loaderData.city;

		const description = `Explore ${city.name} and discover attractions on Wanderlust`;

		const { meta, links } = seo({
			title: city.name,
			description,
			applicationName: 'Wanderlust',
			openGraph: {
				title: city.name,
				type: 'website',
				url: `/cities/${city.id}`,
				locale: 'en_US',
				images: [
					{
						url: city.image ?? '',
						alt: city.name,
					},
				],
				description,
				siteName: 'Wanderlust',
			},
			twitter: {
				card: 'summary_large_image',
				title: city.name,
				description,
				images: [
					{
						url: city.image ?? '',
						alt: city.name,
					},
				],
			},
		});

		return {
			meta,
			links,
		};
	},
	errorComponent: ErrorComponent,
});

function RouteComponent() {
	const { city } = Route.useLoaderData();

	return (
		<div className="mx-auto w-full max-w-7xl py-8">
			<CityBreadcrumb />

			<Description />

			<SuspenseWrapper
				variant="skeleton"
				classNames={{
					root: 'w-full h-80 mt-16 mb-8',
				}}
			>
				<MapComponent />
			</SuspenseWrapper>

			<div className="mt-8">
				<h3 className="mb-8 text-lg md:text-2xl">Discover {city.name}</h3>{' '}
				<TagNavigation cityName={city.name} />
			</div>
			<SuspenseWrapper
				classNames={{
					root: 'mx-auto w-full h-32',
				}}
				variant="skeleton"
			>
				<Collections id={city.id} />
			</SuspenseWrapper>
		</div>
	);
}

function Collections({ id }: { id: number }) {
	const query = useSuspenseQuery(
		orpc.collections.cities.list.queryOptions({ input: { cityId: id } }),
	);

	const ilr = useInterleaveRenderer();

	return (
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
	);
}
