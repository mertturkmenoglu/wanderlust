import { createFileRoute, Link } from '@tanstack/react-router';
import Markdown from 'react-markdown';
import { AppMessage } from '@/components/blocks/app-message';
import { PlaceCard } from '@/components/blocks/place-card';

export const Route = createFileRoute('/c/$id/')({
	component: RouteComponent,
	loader: ({ context, params }) => {
		return context.queryClient.ensureQueryData(
			context.orpc.collections.get.queryOptions({
				input: {
					id: params.id,
				},
			}),
		);
	},
});

function RouteComponent() {
	const { collection } = Route.useLoaderData();
	return (
		<div className="mx-auto mt-8 max-w-7xl md:mt-16">
			<h2 className="font-bold text-4xl">{collection.name}</h2>
			<div className="prose mt-8">
				<Markdown>{collection.description}</Markdown>
			</div>
			{collection.items.length === 0 && (
				<AppMessage
					emptyMessage="There are no items in this collection"
					showBackButton={false}
					className="mt-8"
				/>
			)}
			<div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
				{collection.items.map((item) => (
					<Link
						to="/p/$id"
						params={{
							id: item.placeId,
						}}
						key={item.placeId}
					>
						<PlaceCard place={item.place} />
					</Link>
				))}
			</div>
		</div>
	);
}
