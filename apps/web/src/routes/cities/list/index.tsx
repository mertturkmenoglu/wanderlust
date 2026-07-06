import { createFileRoute } from '@tanstack/react-router';
import { Separator } from '@wanderlust/ui/components/separator';
import { CategoriesBanner } from '@/components/banner/common';
import { orpc } from '@/lib/orpc';
import { seo } from '@/lib/seo';
import { CityItem } from './-item';
import { groupCitiesByCountry } from './-utils';

export const Route = createFileRoute('/cities/list/')({
	component: RouteComponent,
	loader: ({ context }) =>
		context.queryClient.ensureQueryData(
			orpc.cities.list.queryOptions({
				input: {},
			}),
		),
	head: () => {
		const description = 'Explore cities and discover attractions on Wanderlust';

		const { meta, links } = seo({
			title: 'Cities',
			description,
			applicationName: 'Wanderlust',
			openGraph: {
				title: 'Cities',
				type: 'website',
				url: '/cities/list',
				locale: 'en_US',
				images: [
					{
						url: '/logo.png',
						alt: 'Wanderlust',
					},
				],
				description,
				siteName: 'Wanderlust',
			},
			twitter: {
				card: 'summary_large_image',
				title: 'Cities',
				description,
				images: [
					{
						url: '/logo.png',
						alt: 'Wanderlust',
					},
				],
			},
		});

		return {
			meta,
			links,
		};
	},
});

function RouteComponent() {
	const { cities } = Route.useLoaderData();
	const groups = groupCitiesByCountry(cities);

	return (
		<div className="mx-auto w-full max-w-7xl">
			<CategoriesBanner
				classNames={{
					root: 'my-8',
				}}
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
