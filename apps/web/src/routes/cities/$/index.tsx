import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, Link } from '@tanstack/react-router';
import { Image } from '@unpic/react';
import { Button, buttonVariants } from '@wanderlust/ui/components/button';
import { ScrollArea, ScrollBar } from '@wanderlust/ui/components/scroll-area';
import { MapIcon } from 'lucide-react';
import { OverlayBanner } from '@/components/banner/overlay';
import { ErrorComponent } from '@/components/error-component';
import { PlaceCard } from '@/components/place-card';
import { SuspenseWrapper } from '@/components/suspense-wrapper';
import { TagNavigation } from '@/components/tag-navigation';
import { useIsMobile } from '@/hooks/use-mobile';
import { ipx } from '@/lib/ipx';
import { orpc } from '@/lib/orpc';
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
	const isMobile = useIsMobile();

	return (
		<div className="mx-auto max-w-7xl py-8">
			<CityBreadcrumb cityName={city.name} />

			<div className="mt-4 grid grid-cols-5 gap-4 md:mt-8 md:gap-8">
				<div className="col-span-5 lg:col-span-2">
					<div className="">
						<Image
							src={ipx(city.image, 'w_512')}
							alt=""
							className="aspect-video rounded-md object-cover"
							width={512}
							aspectRatio={16 / 9}
						/>
					</div>
				</div>

				<div className="col-span-5 lg:col-span-3">
					<h2 className="font-bold text-3xl md:text-6xl">{city.name}</h2>
					<div className="mt-2 text-muted-foreground text-sm md:font-semibold md:text-base">
						{city.stateName}/{city.countryName}
					</div>
					<div className="mt-4 text-base text-muted-foreground md:text-lg">
						{city.description}
					</div>
				</div>
			</div>

			<MapComponent latitude={city.lat} longitude={city.lng} />

			<div className="mt-8">
				<h3 className="mb-8 text-lg md:text-2xl">Discover {city.name}</h3>
				<TagNavigation urlSuffix={`&city=${city.name}`} />
			</div>

			<OverlayBanner
				image="https://images.unsplash.com/photo-1491895200222-0fc4a4c35e18"
				alt="Cities Banner Image"
				message={
					<div className="flex items-center gap-4 text-white">
						<div className="text-sm md:text-base">
							Plan a trip to {city.name}
						</div>
						<Button
							asChild
							variant="outline"
							size={isMobile ? 'sm' : 'default'}
							className="bg-white text-midnight"
						>
							<Link to="/trips/planner">
								<MapIcon />
								{isMobile ? 'Start' : 'Start Planning'}
							</Link>
						</Button>
					</div>
				}
				classNames={{
					root: 'my-8',
					image: 'aspect-[3]',
					messageContainer: 'bg-black/60',
				}}
			/>

			<SuspenseWrapper>
				<CollectionsContent />
			</SuspenseWrapper>

			<OverlayBanner
				image={city.image}
				alt={`${city.name} image`}
				message={
					<div className="flex items-center gap-4 text-white">
						<div className="text-sm md:text-base">
							Find all places in {city.name}
						</div>
						<Button
							asChild
							variant="warning"
							size={isMobile ? 'sm' : 'default'}
						>
							<Link
								to="/search"
								search={{
									city: city.name,
								}}
							>
								Browse
							</Link>
						</Button>
					</div>
				}
				classNames={{
					root: 'my-8',
					image: 'aspect-[3]',
					messageContainer: 'bg-black/60',
				}}
			/>
		</div>
	);
}

function CollectionsContent() {
	const {
		city: { id },
	} = Route.useLoaderData();
	const query = useSuspenseQuery(
		orpc.collections.listByCityId.queryOptions({ input: { cityId: id } }),
	);

	return (
		<div className="mt-8 space-y-8">
			{query.data.collections.map((collection) => (
				<div key={collection.id}>
					<div
						key={collection.id}
						className="mb-4 flex items-baseline justify-between gap-4 md:justify-start"
					>
						<h3 className="line-clamp-1 text-lg md:text-2xl">
							{collection.name}
						</h3>
						<Link
							to="/c/$id"
							params={{
								id: collection.id,
							}}
							className={buttonVariants({
								variant: 'link',
								className: 'px-0!',
							})}
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
									<PlaceCard place={item.place} className="w-[256px]" />
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
