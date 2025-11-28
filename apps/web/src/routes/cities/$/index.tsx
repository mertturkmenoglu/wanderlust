import { createFileRoute, Link } from '@tanstack/react-router';
import { ErrorComponent } from '@/components/blocks/error-component';
import { OverlayBanner } from '@/components/blocks/overlay-banner';
import { PlaceCard } from '@/components/blocks/place-card';
import { SuspenseWrapper } from '@/components/blocks/suspense-wrapper';
import { TagNavigation } from '@/components/blocks/tag-navigation';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { api } from '@/lib/api';
import { ipx } from '@/lib/ipx';
import { CityBreadcrumb } from './-city-breadcrumb';
import { MapComponent } from './-map';

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
			api.queryOptions('get', '/api/v2/cities/{id}', {
				params: {
					path: {
						id: +cityId,
					},
				},
			}),
		);
	},
	errorComponent: ErrorComponent,
});

function RouteComponent() {
	const { city } = Route.useLoaderData();

	return (
		<div className="mx-auto max-w-7xl py-8">
			<CityBreadcrumb cityName={city.name} />

			<div className="mt-8 grid grid-cols-5 gap-8">
				<div className="col-span-5 lg:col-span-2">
					<div className="">
						<img
							src={ipx(city.image, 'f_webp,w_1024')}
							alt=""
							className="aspect-video rounded-md object-cover"
						/>
					</div>
				</div>

				<div className="col-span-5 lg:col-span-3">
					<h2 className="font-bold text-6xl">{city.name}</h2>
					<div className="mt-2 text-muted-foreground text-sm">
						{city.state.name}/{city.country.name}
					</div>
					<div className="mt-4 text-lg text-muted-foreground">
						{city.description}
					</div>
				</div>
			</div>

			<MapComponent latitude={city.lat} longitude={city.lng} />

			<div className="mt-8">
				<h3 className="mb-8 font-bold text-2xl">Discover {city.name}</h3>
				<TagNavigation urlSuffix={`&city=${city.name}`} />
			</div>

			<OverlayBanner
				image="https://images.unsplash.com/photo-1491895200222-0fc4a4c35e18?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
				alt="Cities Banner Image"
				message={
					<div className="flex items-center gap-4">
						<div>Plan a trip to {city.name}</div>
						<Button asChild variant="default">
							<Link to="/trips/planner">Start Planning</Link>
						</Button>
					</div>
				}
				className="my-8"
				imgClassName="aspect-[3]"
			/>

			<SuspenseWrapper>
				<CollectionsContent />
			</SuspenseWrapper>

			<OverlayBanner
				image={city.image}
				alt={`${city.name} image`}
				message={
					<div className="flex items-center gap-4">
						<div>See all locations in {city.name}</div>
						<Button asChild variant="default">
							<Link
								to="/search"
								search={{
									city: city.name,
								}}
							>
								Discover
							</Link>
						</Button>
					</div>
				}
				className="my-8"
				imgClassName="aspect-[3]"
			/>
		</div>
	);
}

function CollectionsContent() {
	const {
		city: { id },
	} = Route.useLoaderData();
	const query = api.useSuspenseQuery('get', '/api/v2/collections/city/{id}', {
		params: {
			path: {
				id,
			},
		},
	});

	return (
		<div className="mt-8 space-y-8">
			{query.data.collections.map((collection) => (
				<div key={collection.id}>
					<div key={collection.id} className="mb-4 flex items-baseline gap-4">
						<h3 className="font-bold text-2xl">{collection.name}</h3>
						<Link
							to="/c/$id"
							params={{
								id: collection.id,
							}}
							className="text-base text-primary decoration-2 decoration-primary underline-offset-4 hover:underline"
						>
							See more
						</Link>
					</div>

					<ScrollArea>
						<div className="my-4 flex gap-8">
							{collection.items.map((item) => (
								<Link
									key={item.placeId}
									to="/p/$id"
									params={{
										id: item.placeId,
									}}
								>
									<PlaceCard
										place={item.place}
										className="w-[256px]"
										hoverEffects={false}
									/>
								</Link>
							))}
						</div>
						<ScrollBar orientation="horizontal" className="mt-8" />
					</ScrollArea>
				</div>
			))}
		</div>
	);
}
