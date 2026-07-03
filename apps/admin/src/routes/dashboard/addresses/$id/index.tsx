import { createFileRoute } from '@tanstack/react-router';
import { CityCard } from '@/components/city-card';
import { Container } from '@/components/container';
import { renderer } from '@/components/details/renderer';
import { Show } from '@/components/show';
import { defineRows } from '@/lib/define-rows';
import { addressesResource } from '@/resources/addresses';

export const Route = createFileRoute('/dashboard/addresses/$id/')({
	component: RouteComponent,
	staticData: {
		breadcrumb: 'Address Details',
	},
});

function RouteComponent() {
	const params = Route.useParams();
	const query = addressesResource.useOne({
		id: +params.id,
	});

	if (!query.data) {
		return null;
	}

	const { address } = query.data;

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
		<Container>
			<Show
				resource={addressesResource}
				input={{
					id: address.id,
				}}
				deleteInput={{
					id: address.id,
				}}
				rows={rows}
			/>
		</Container>
	);
}
