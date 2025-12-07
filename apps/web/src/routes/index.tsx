import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, Link } from '@tanstack/react-router';
import { Image } from '@unpic/react';
import { Skeleton } from '@wanderlust/ui/components/skeleton';
import { ActionBanner } from '@/components/action-banner';
import { OverlayBanner } from '@/components/overlay-banner';
import { PlacesGrid } from '@/components/places-grid';
import { QuickActions } from '@/components/quick-actions';
import { Search } from '@/components/search';
import { SuspenseWrapper } from '@/components/suspense-wrapper';
import { TagNavigation } from '@/components/tag-navigation';
import { VerticalBanner } from '@/components/vertical-banner';
import { authClient } from '@/lib/auth';
import { ipx } from '@/lib/ipx';
import { orpc } from '@/lib/orpc';
import { Button } from '@wanderlust/ui/components/button';

export const Route = createFileRoute('/')({
	component: App,
});

function App() {
	const session = authClient.useSession();
	const isAuthenticated = !session.isPending && session.data !== null;

	return (
		<div className="mx-auto mt-8 max-w-7xl">
			<Search />

			<TagNavigation />

			{session.isPending ? (
				<Skeleton className="my-8 h-64 w-full" />
			) : isAuthenticated ? (
				<QuickActions />
			) : (
				<OverlayBanner
					image="https://images.unsplash.com/photo-1524168272322-bf73616d9cb5?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
					alt="Wanderlust Banner Image"
					message="Inspiring explorations, one spark of Wanderlust!"
					className="my-8"
				/>
			)}

			<SuspenseWrapper>
				<Content />
			</SuspenseWrapper>
		</div>
	);
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
			<div className="flex items-baseline">
				<h2 className="font-semibold text-2xl">Featured Cities</h2>
				<Button asChild variant="link">
					<Link to="/cities/list">See all</Link>
				</Button>
			</div>

			<div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
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
						<div className="mt-2 font-bold text-base">{city.name}</div>
					</Link>
				))}
			</div>

			<OverlayBanner
				image="https://images.unsplash.com/photo-1607388510015-c632e99da586?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
				alt="Categories Banner Image"
				message={
					<div className="flex items-center gap-4">
						<div>Discover the world around you</div>
						<Button asChild variant="default">
							<Link to="/categories">See categories</Link>
						</Button>
					</div>
				}
				className="my-8"
				imgClassName="aspect-[3]"
			/>

			<PlacesGrid dataKey="featured" data={aggregations.featured} />

			<VerticalBanner
				image="https://i.imgur.com/Y3ujIqE.jpg"
				alt="Discover Around You Banner Image"
				content={
					<div className="text-center">
						<h2 className="mt-8 font-bold font-serif text-3xl text-black/80">
							Discover new locations around you
						</h2>
						<p className="font-serif text-muted-foreground">
							Find new places to explore and enjoy with your friends and family.
						</p>
						<Button asChild size="lg" variant="secondary" className="mt-8">
							<Link to="/nearby">Start Exploring</Link>
						</Button>
					</div>
				}
			/>

			<PlacesGrid dataKey="popular" data={aggregations.popular} />

			<ActionBanner
				image="https://i.imgur.com/mWzmPRv.jpg"
				alt="Trip Planner Banner Image"
				message={
					<div className="flex flex-col gap-4">
						<div className="font-bold text-2xl text-primary">
							Plan your next trip
						</div>
						<div className="text-muted-foreground text-sm">
							Plan your next trip with our trip planner tool. It&apos;s easy to
							use and you can save your trips for later.
						</div>
						<Button asChild variant="default">
							<Link to="/trips/planner" className="text-white">
								Go to Trip Planner
							</Link>
						</Button>
					</div>
				}
				className="my-8"
				imgClassName=""
			/>

			<PlacesGrid dataKey="favorite" data={aggregations.favorites} />

			<ActionBanner
				image="https://i.imgur.com/CNtFbZT.jpg"
				alt="Events Banner Image"
				message={
					<div className="flex flex-col gap-4">
						<div className="font-bold text-2xl text-primary">
							Explore Upcoming Events
						</div>
						<div className="text-muted-foreground text-sm">
							Check out the upcoming events in your area. You can also add your
							own events to the list.
						</div>
						<Button asChild variant="secondary">
							<Link to="/discover/events">See events</Link>
						</Button>
					</div>
				}
				className="my-8"
				imgClassName=""
				lefty={false}
			/>

			<PlacesGrid dataKey="new" data={aggregations.new} />
		</>
	);
}
