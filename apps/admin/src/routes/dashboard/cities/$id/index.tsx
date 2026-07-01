import { createFileRoute } from '@tanstack/react-router';
import { Container } from '@/components/container';
import { renderer } from '@/components/details/renderer';
import { Show } from '@/components/show';
import { defineRows } from '@/lib/define-rows';
import { citiesResource } from '@/resources/cities';

export const Route = createFileRoute('/dashboard/cities/$id/')({
	component: RouteComponent,
	staticData: {
		breadcrumb: 'City Details',
	},
});

function RouteComponent() {
	const params = Route.useParams();
	const query = citiesResource.useOne({
		id: +params.id,
	});

	if (!query.data) {
		return null;
	}

	const { city } = query.data;

	const rows = defineRows([
		['ID', city.id.toString()],
		['Name', city.name],
		['Description', city.description],
		['State Code', city.stateCode],
		['State Name', city.stateName],
		['Country Code', city.countryCode],
		['Country Name', city.countryName],
		['Image', renderer.Image(city.image)],
		['Coordinates', `Lat: ${city.lat}, Lng: ${city.lng}`],
		['Timezone', city.timezone],
	]);

	return (
		<Container>
			<Show
				resource={citiesResource}
				input={{
					id: city.id,
				}}
				deleteInput={{
					id: city.id,
				}}
				rows={rows}
			/>
		</Container>
	);
}
