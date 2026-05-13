import { createFileRoute, Link } from '@tanstack/react-router';
import { Image } from '@unpic/react';
import { ipx } from '@/lib/ipx';
import { serializeParams } from '@/lib/search';

export const Route = createFileRoute('/categories/')({
	component: RouteComponent,
	loader: ({ context: { queryClient, orpc } }) =>
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
		<div className="mx-auto max-w-7xl">
			<div className="flex items-baseline">
				<h2 className="mt-8 font-bold text-4xl">Browse by category</h2>
			</div>

			<div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
				{categories.map((category) => (
					<Link
						to="/search"
						search={{
							category: serializeParams([category.name]),
						}}
						key={category.id}
						className="rounded-md"
					>
						<Image
							src={ipx(category.image, 'w_512')}
							alt=""
							className="aspect-video w-full rounded-md object-cover"
							width={512}
							aspectRatio={16 / 9}
						/>
						<div className="mt-2 font-bold text-xl lg:text-base">
							{category.name}
						</div>
					</Link>
				))}
			</div>
		</div>
	);
}
