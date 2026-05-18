import { createFileRoute, Link } from '@tanstack/react-router';
import { Button } from '@wanderlust/ui/components/button';
import { Separator } from '@wanderlust/ui/components/separator';
import { OverlayBanner } from '@/components/overlay-banner';
import { CityItem } from './-item';
import { groupCitiesByCountry } from './-utils';

export const Route = createFileRoute('/cities/list/')({
	component: RouteComponent,
	loader: ({ context }) =>
		context.queryClient.ensureQueryData(
			context.orpc.cities.list.queryOptions({
				input: {},
			}),
		),
});

function RouteComponent() {
	const { cities } = Route.useLoaderData();
	const groups = groupCitiesByCountry(cities);

	return (
		<div className="mx-auto max-w-7xl">
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

			<div className="my-8">
				{groups.map((group) => (
					<div key={group[0]} className="my-8">
						<h3 className="font-semibold text-xl">{group[0]}</h3>
						<Separator />
						<div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
							{group[1].map((city) => (
								<CityItem city={city} key={city.id} />
							))}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
