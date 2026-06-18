import { createFileRoute } from '@tanstack/react-router';
import { Separator } from '@wanderlust/ui/components/separator';
import { z } from 'zod';
import { AssetGrid } from '@/components/asset-grid';
import { AppBentoBanner } from '@/components/banner/common';
import { ErrorComponent } from '@/components/error-component';
import { Amenities } from './-components/amenities';
import { Breadcrumb } from './-components/breadcrumb';
import { CityInfo } from './-components/city-info';
import { CityTagNavigation } from './-components/city-tag-navigation';
import { Collections } from './-components/collections';
import { Description } from './-components/description';
import { Header } from './-components/header';
import { Information } from './-components/information';
import { MapComponent } from './-components/map';
import { NearbyPlaces } from './-components/nearby-places';
import { Reviews } from './-components/reviews';

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
			context.orpc.places.get.queryOptions({
				input: {
					id: params.id,
				},
			}),
		);
	},
	errorComponent: ErrorComponent,
	validateSearch: schema,
});

function RouteComponent() {
	const { place } = Route.useLoaderData();

	return (
		<main className="mx-auto mt-8 max-w-7xl">
			<Breadcrumb />

			<Header className="mt-8" />

			<AssetGrid className="mt-8" assets={place.assets} />

			<Description className="mt-8" />

			<Separator className="my-4" />

			<div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-16">
				<Information className="col-span-1" />

				<MapComponent className="col-span-2" />
			</div>

			<Separator className="my-4" />

			<Amenities className="" />

			<Separator className="my-4" />

			<NearbyPlaces className="col-span-2" />

			<Separator className="my-4" />

			<CityInfo className="my-4" />

			<Separator className="my-4" />

			<Reviews />

			<Separator className="my-4" />

			<Collections className="my-4" />

			<CityTagNavigation className="my-4" />

			<AppBentoBanner classNames={{ root: 'my-4' }} />
		</main>
	);
}
