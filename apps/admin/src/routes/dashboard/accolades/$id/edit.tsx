import { createFileRoute } from '@tanstack/react-router';
import { Container } from '@/components/container';
import { accoladesResource } from '@/resources/accolades';
import { Upsert } from '../-upsert';

export const Route = createFileRoute('/dashboard/accolades/$id/edit')({
	component: RouteComponent,
	staticData: {
		breadcrumb: 'Edit Accolade',
	},
});

function RouteComponent() {
	const params = Route.useParams();
	const query = accoladesResource.useOne({
		id: params.id,
	});

	if (!query.data) {
		return null;
	}

	const { accolade } = query.data;

	return (
		<Container>
			<Upsert action="edit" accolade={accolade} />
		</Container>
	);
}
