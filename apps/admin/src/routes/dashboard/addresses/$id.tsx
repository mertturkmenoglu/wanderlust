import { createFileRoute } from '@tanstack/react-router';
import { CityCard } from '@/components/city-card';
import { renderer } from '@/components/details/renderer';
import { Show } from '@/components/show';
import { ensureData, getDefaultStaticData } from '@/lib/defaults';
import { defineRows } from '@/lib/define-rows';
import { addressesResource as r } from '@/resources/addresses';

export const Route = createFileRoute('/dashboard/addresses/$id')({
	component: RouteComponent,
	loader: async ({ params, context }) => {
		return ensureData(r, context.qc, {
			input: {
				id: +params.id,
			},
		});
	},
	staticData: getDefaultStaticData(r, 'details'),
});

function RouteComponent() {
	const { address } = Route.useLoaderData();

	const rows = defineRows([
		['ID', address.id],
		['Line 1', address.line1],
		['Line 2', address.line2],
		['Postal Code', address.postalCode],
		['Latitude', address.lat],
		['Longitude', address.lng],
		[
			'City',
			renderer.Link(
				'City',
				{
					to: '/dashboard/cities/$id',
					params: {
						id: address.city.id.toString(),
					},
				},
				<CityCard className="min-w-sm" city={address.city} />,
			),
		],
	]);

	return (
		<Show
			resource={r}
			input={{
				id: address.id,
			}}
			deleteInput={{
				id: address.id,
			}}
			rows={rows}
			data={address}
		/>
	);
}
