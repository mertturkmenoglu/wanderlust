import { createFileRoute } from '@tanstack/react-router';
import { Container } from '@/components/container';
import { citiesResource } from '@/resources/cities';
import { Upsert } from '../-upsert';

export const Route = createFileRoute('/dashboard/cities/$id/edit')({
	component: RouteComponent,
	staticData: {
		breadcrumb: 'Edit City',
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

	return (
		<Container>
			<Upsert action="edit" city={city} />
		</Container>
	);
}
