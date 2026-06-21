import { createFileRoute, Link } from '@tanstack/react-router';
import { Image } from '@unpic/react';
import { Item, ItemTitle } from '@wanderlust/ui/components/item';
import { ipx } from '@/lib/ipx';
import { orpc } from '@/lib/orpc';
import { serializeParams } from '@/lib/search';

export const Route = createFileRoute('/categories/')({
	component: RouteComponent,
	loader: ({ context: { queryClient } }) =>
		queryClient.ensureQueryData(
			orpc.categories.list.queryOptions({
				input: {},
			}),
		),
});

function RouteComponent() {
	const query = Route.useLoaderData();

	const categories = query.categories;

	return (
		<div className="mx-auto my-8 w-full max-w-7xl">
			<h2 className="text-2xl">Browse by Category</h2>

			<div className="mt-4 grid grid-cols-2 gap-4">
				{categories.map((category) => (
					<Link
						to="/search"
						search={{
							category: serializeParams([category.name]),
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
							<ItemTitle className="line-clamp-1">{category.name}</ItemTitle>
						</Item>
					</Link>
				))}
			</div>
		</div>
	);
}
