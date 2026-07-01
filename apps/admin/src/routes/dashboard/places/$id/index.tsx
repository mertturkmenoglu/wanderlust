import { createFileRoute } from '@tanstack/react-router';
import { Container } from '@/components/container';
import { renderer } from '@/components/details/renderer';
import { Show } from '@/components/show';
import { defineRows } from '@/lib/define-rows';
import { placesResource } from '@/resources/places';

export const Route = createFileRoute('/dashboard/places/$id/')({
	component: RouteComponent,
	staticData: {
		breadcrumb: 'Place Details',
	},
});

function RouteComponent() {
	const params = Route.useParams();
	const query = placesResource.useOne({
		id: params.id,
	});

	if (!query.data) {
		return null;
	}

	const { place } = query.data;

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
					to: '/dashboard',
				},
				renderer.JSON(place.address),
			),
		],
		[
			'Category',
			renderer.Link('Category', { to: '/dashboard' }, place.category.name),
		],
		['Price Level', place.priceLevel],
		['Accessibility Level', place.accessibilityLevel],
		['Total Votes', place.totalVotes],
		['Total Points', place.totalPoints],
		['Total Favorites', place.totalFavorites],
		['Hours', renderer.JSON(place.hours)],
		['Amenities', renderer.JSON(place.amenities)],
		['Accolades', renderer.JSON(place.accolades)],
		['Created At', renderer.Date(place.createdAt)],
		['Updated At', renderer.Date(place.updatedAt)],
		['Assets', renderer.Gallery(place.assets.map((asset) => asset.url))],
	]);

	return (
		<Container>
			<Show
				resource={placesResource}
				input={{
					id: place.id,
				}}
				deleteInput={{
					id: place.id,
				}}
				rows={rows}
			/>
		</Container>
	);
}
