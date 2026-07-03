import { createFileRoute } from '@tanstack/react-router';
import { KeyValueList } from '@wanderlust/ui/components/key-value-list';
import { AccoladeCard } from '@/components/accolade-card';
import { AddressCard } from '@/components/address-card';
import { CategoryCard } from '@/components/category-card';
import { renderer } from '@/components/details/renderer';
import { Show } from '@/components/show';
import { ensureData, getDefaultStaticData } from '@/lib/defaults';
import { defineRows } from '@/lib/define-rows';
import { toTitleCase } from '@/lib/text';
import { placesResource as r } from '@/resources/places';

export const Route = createFileRoute('/dashboard/places/$id/')({
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
	const { place } = Route.useLoaderData();

	const hours = Object.entries(place.hours)
		.toSorted((a, b) => {
			const daysOfWeek = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
			return daysOfWeek.indexOf(a[0]) - daysOfWeek.indexOf(b[0]);
		})
		.map(([day, time]) => ({
			label: toTitleCase(day),
			value: time,
		}));

	const rows = defineRows([
		['ID', place.id],
		['Name', place.name],
		['Description', place.description],
		['Phone', place.phone],
		['Website', renderer.ExternalLink('Website', place.website ?? '—')],
		[
			'Address',
			renderer.Link(
				'Address',
				{
					to: '/dashboard/addresses/$id',
					params: {
						id: place.address.id.toString(),
					},
				},
				<AddressCard className="min-w-sm" address={place.address} />,
			),
		],
		[
			'Category',
			renderer.Link(
				'Category',
				{
					to: '/dashboard/categories/$id',
					params: {
						id: place.category.id.toString(),
					},
				},
				<CategoryCard className="min-w-sm" category={place.category} />,
			),
		],
		['Price Level', place.priceLevel],
		['Accessibility Level', place.accessibilityLevel],
		['Total Votes', place.totalVotes],
		['Total Points', place.totalPoints],
		['Total Favorites', place.totalFavorites],
		['Hours', <KeyValueList variant="bordered" items={hours} />],
		['Amenities', renderer.Array(place.amenities, true)],
		[
			'Accolades',
			renderer.Multiple(
				place.accolades.map((a) => (
					<AccoladeCard accolade={a.accolade} className="min-w-sm" />
				)),
			),
		],
		['Created At', renderer.Date(place.createdAt)],
		['Updated At', renderer.Date(place.updatedAt)],
		['Assets', renderer.Gallery(place.assets.map((asset) => asset.url))],
	]);

	return (
		<Show
			resource={r}
			input={{
				id: place.id,
			}}
			deleteInput={{
				id: place.id,
			}}
			rows={rows}
			data={place}
		/>
	);
}
