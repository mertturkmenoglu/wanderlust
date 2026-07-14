import { createFileRoute, Link } from '@tanstack/react-router';
import { Image } from '@unpic/react';
import { Item, ItemTitle } from '@wanderlust/ui/components/item';
import { CategoriesBanner } from '@/components/banner/common';
import { ipx } from '@/lib/ipx';
import { orpc } from '@/lib/orpc';
import { serializeParams } from '@/lib/search';
import { seo } from '@/lib/seo';

export const Route = createFileRoute('/categories/')({
	component: RouteComponent,
	loader: ({ context: { queryClient } }) =>
		queryClient.ensureQueryData(
			orpc.categories.list.queryOptions({
				input: {},
			}),
		),
	head: () =>
		seo({
			title: 'Categories',
			description: 'Browse categories on Wanderlust',
			applicationName: 'Wanderlust',
			openGraph: {
				title: 'Categories',
				type: 'website',
				url: '/categories/',
				locale: 'en_US',
				images: [
					{
						url: '/logo.png',
						alt: 'Wanderlust',
					},
				],
				description: 'Browse categories on Wanderlust',
				siteName: 'Wanderlust',
			},
			twitter: {
				card: 'summary_large_image',
				title: 'Categories',
				description: 'Browse categories on Wanderlust',
				images: [
					{
						url: '/logo.png',
						alt: 'Wanderlust',
					},
				],
			},
		}),
});

function RouteComponent() {
	const query = Route.useLoaderData();

	const categories = query.categories;

	return (
		<div className="mx-auto my-8 w-full max-w-7xl">
			<CategoriesBanner />

			<h2 className="mt-8 text-2xl">Browse by Category</h2>

			<div className="mt-4 grid grid-cols-2 gap-4">
				{categories.map((category) => (
					<Link
						to="/search/$type"
						params={{ type: 'places' }}
						search={{
							category: serializeParams([category.id]),
						}}
						key={category.id}
					>
						<Item
							variant="default"
							size="sm"
							className="pl-0 hover:-ml-4 hover:bg-muted hover:pl-4"
						>
							<Image
								src={ipx(category.image, 'w_512')}
								alt=""
								className="aspect-video w-48 rounded-md object-cover"
								layout="constrained"
								width={512}
								aspectRatio={16 / 9}
							/>
							<ItemTitle className="line-clamp-1">
								{category.displayName}
							</ItemTitle>
						</Item>
					</Link>
				))}
			</div>
		</div>
	);
}
