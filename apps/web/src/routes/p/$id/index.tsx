import { createFileRoute } from '@tanstack/react-router';
import { Separator } from '@wanderlust/ui/components/separator';
import { lazy } from 'react';
import { z } from 'zod';
import { AssetGrid } from '@/components/asset-grid';
import { AppBentoBanner } from '@/components/banner/common';
import { ErrorComponent } from '@/components/error-component';
import { SuspenseWrapper } from '@/components/suspense-wrapper';
import { orpc } from '@/lib/orpc';
import { seo } from '@/lib/seo';
import { Accolades } from './-components/accolades';
import { Amenities } from './-components/amenities';
import { Breadcrumb } from './-components/breadcrumb';
import { CityInfo } from './-components/city-info';
import { CityTagNavigation } from './-components/city-tag-navigation';
import { Collections } from './-components/collections';
import { Description } from './-components/description';
import { Header } from './-components/header';
import { Information } from './-components/information';
import { NearbyCities } from './-components/nearby-cities';
import { NearbyPlaces } from './-components/nearby-places';
import { ReviewsPreview } from './-components/reviews-preview';
import { useTrackRecentViews } from './-hooks';

const MapComponent = lazy(() =>
	import('./-components/map').then((mod) => ({ default: mod.MapComponent })),
);

const schema = z.object({
	page: z.number().min(1).max(100).optional(),
	minRating: z.number().min(0).max(5).optional(),
	maxRating: z.number().min(0).max(5).optional(),
	sortBy: z.enum(['created_at', 'rating']).optional(),
	sortOrd: z.enum(['asc', 'desc']).optional(),
});

export const Route = createFileRoute('/p/$id/')({
	component: RouteComponent,
	loader: ({ context, params }) => {
		return context.queryClient.ensureQueryData(
			orpc.places.get.queryOptions({
				input: {
					id: params.id,
				},
			}),
		);
	},
	head: ({ loaderData }) => {
		if (!loaderData) {
			return {
				title: 'Place Not Found',
				meta: [
					{
						name: 'description',
						content: 'Place not found',
					},
				],
			};
		}

		const place = loaderData.place;

		const description =
			place.description ?? `Explore ${place.name} on Wanderlust`;

		const images = place.assets.map((asset) => ({
			url: asset.url,
			alt: asset.description ?? place.name,
		}));

		const { meta, links } = seo({
			title: place.name,
			description,
			applicationName: 'Wanderlust',
			openGraph: {
				title: place.name,
				type: 'website',
				url: `/p/${place.id}`,
				locale: 'en_US',
				images: images,
				description,
				siteName: 'Wanderlust',
			},
			twitter: {
				card: 'summary_large_image',
				title: place.name,
				description,
				images: images.map((image) => image.url),
			},
		});

		return {
			meta,
			links,
		};
	},
	errorComponent: ErrorComponent,
	validateSearch: schema,
});

function RouteComponent() {
	const { place } = Route.useLoaderData();

	useTrackRecentViews();

	return (
		<main className="mx-auto mt-8 w-full max-w-7xl">
			<Breadcrumb />

			<Header className="mt-8" />

			<AssetGrid className="mt-8" assets={place.assets} />

			<Accolades className="mt-8" />

			<Description className="mt-8" />

			<Separator className="my-4" />

			<div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-16">
				<Information className="col-span-1" />

				<SuspenseWrapper
					variant="skeleton"
					classNames={{
						placeholder: 'w-full! col-span-2!',
						root: 'col-span-2 my-4',
					}}
				>
					<MapComponent className="col-span-2" />
				</SuspenseWrapper>
			</div>

			<Separator className="my-4" />

			<Amenities className="" />

			<Separator className="my-4" />

			<NearbyPlaces className="col-span-2" />

			<NearbyCities className="my-4" />

			<Separator className="my-4" />

			<CityInfo className="my-4" />

			<Separator className="my-4" />

			<ReviewsPreview />

			<Separator className="my-4" />

			<Collections className="my-4" />

			<CityTagNavigation className="my-4" />

			<AppBentoBanner classNames={{ root: 'my-4' }} />
		</main>
	);
}
