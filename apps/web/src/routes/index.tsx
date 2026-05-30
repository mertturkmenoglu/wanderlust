import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, Link } from '@tanstack/react-router';
import { Image } from '@unpic/react';
import { Button } from '@wanderlust/ui/components/button';
import { Skeleton } from '@wanderlust/ui/components/skeleton';
import {
	AppBanner,
	CategoriesBanner,
	EventBanner,
	NearbyLocationsBanner,
	TripPlannerBanner,
	TripPlannerCta,
} from '@/components/banner/common';
import { PlacesGrid } from '@/components/places-grid';
import { QuickActions } from '@/components/quick-actions';
import { Search } from '@/components/search';
import { SuspenseWrapper } from '@/components/suspense-wrapper';
import { TagNavigation } from '@/components/tag-navigation';
import { authClient } from '@/lib/auth';
import { ipx } from '@/lib/ipx';
import { orpc } from '@/lib/orpc';

export const Route = createFileRoute('/')({
	component: App,
});

function App() {
	return (
		<div className="mx-auto mt-8 max-w-7xl">
			<Search />

			<TagNavigation />

			<Banner />

			<SuspenseWrapper>
				<Content />
			</SuspenseWrapper>
		</div>
	);
}

function Banner() {
	const session = authClient.useSession();
	const isAuthenticated = !session.isPending && session.data !== null;

	if (session.isPending) {
		return <Skeleton className="my-8 h-64 w-full" />;
	}

	if (isAuthenticated) {
		return <QuickActions className="mt-4 md:mt-8" />;
	}

	return <AppBanner />;
}

function Content() {
	const { data: aggregations } = useSuspenseQuery(
		orpc.aggregator.home.queryOptions({
			input: {},
		}),
	);

	const { data: cities } = useSuspenseQuery(
		orpc.cities.listFeatured.queryOptions({
			input: {},
		}),
	);

	return (
		<>
			<div className="mt-4 flex items-baseline md:mt-8">
				<h2 className="text-lg md:text-2xl">Featured Cities</h2>
				<Button asChild variant="link">
					<Link to="/cities/list">See all</Link>
				</Button>
			</div>

			<div className="mt-2 grid grid-cols-2 gap-4 md:mt-4 md:grid-cols-3 lg:grid-cols-6">
				{cities.cities.map((city) => (
					<Link
						to="."
						href={`/cities/${city.id}/${city.name}`}
						key={city.id}
						className="rounded-md decoration-2 decoration-primary underline-offset-4 hover:underline"
					>
						<Image
							src={ipx(city.image, 'w_512')}
							layout="constrained"
							width={512}
							priority={true}
							aspectRatio={16 / 9}
							className="aspect-video w-full rounded-md object-cover"
						/>
						<div className="mt-2 text-sm md:text-base">{city.name}</div>
					</Link>
				))}
			</div>

			<CategoriesBanner />

			<PlacesGrid dataKey="featured" data={aggregations.featured} />

			<TripPlannerCta
				classNames={{
					root: 'mt-4 md:mt-8',
				}}
			/>

			<PlacesGrid dataKey="popular" data={aggregations.popular} />

			<NearbyLocationsBanner />

			<PlacesGrid dataKey="favorite" data={aggregations.favorites} />

			<TripPlannerBanner />

			<PlacesGrid dataKey="new" data={aggregations.new} />

			<EventBanner />
		</>
	);
}
