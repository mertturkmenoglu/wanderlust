import { createFileRoute, Link } from '@tanstack/react-router';
import { renderer } from '@/components/details/renderer';
import { PlaceCard } from '@/components/place-card';
import { Show } from '@/components/show';
import { ensureData, getDefaultStaticData } from '@/lib/defaults';
import { defineRows } from '@/lib/define-rows';
import { collectionsResource as r } from '@/resources/collections';

export const Route = createFileRoute('/dashboard/collections/$id')({
	component: RouteComponent,
	loader: async ({ params, context }) => {
		return ensureData(r, context.qc, {
			input: {
				id: params.id,
			},
		});
	},
	staticData: getDefaultStaticData(r, 'details'),
});

function RouteComponent() {
	const { collection } = Route.useLoaderData();

	const rows = defineRows([
		['ID', collection.id],
		['Title', collection.name],
		['Description', collection.description],
		['Created At', renderer.Date(collection.createdAt)],
		[
			'Items',
			renderer.Multiple(
				collection.items.map((item) =>
					renderer.Link(
						'Place',
						{
							to: '/dashboard/places/$id',
							params: {
								id: item.placeId,
							},
						},
						<PlaceCard place={item.place} className="w-3xl" variant="item" />,
					),
				),
			),
		],
		[
			'Relations',
			<Link
				to="/dashboard/collections/$id/relations"
				params={{ id: collection.id }}
			>
				Relations
			</Link>,
		],
	]);

	return (
		<Show
			resource={r}
			input={{
				id: collection.id,
			}}
			deleteInput={{
				id: collection.id,
			}}
			rows={rows}
			data={collection}
		/>
	);
}
