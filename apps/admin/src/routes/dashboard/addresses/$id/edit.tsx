import { createFileRoute } from '@tanstack/react-router';
import { Container } from '@/components/container';
import { addressesResource } from '@/resources/addresses';
import { Upsert } from '../-upsert';

export const Route = createFileRoute('/dashboard/addresses/$id/edit')({
	component: RouteComponent,
	staticData: {
		breadcrumb: 'Edit Address',
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

	return (
		<Container>
			<Upsert action="edit" address={address} />
		</Container>
	);
}
