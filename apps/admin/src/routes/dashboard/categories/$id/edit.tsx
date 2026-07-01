import { createFileRoute } from '@tanstack/react-router';
import { Container } from '@/components/container';
import { categoriesResource } from '@/resources/categories';
import { Upsert } from '../-upsert';

export const Route = createFileRoute('/dashboard/categories/$id/edit')({
	component: RouteComponent,
	staticData: {
		breadcrumb: 'Edit Category',
	},
});

function RouteComponent() {
	const params = Route.useParams();
	const query = categoriesResource.useOne({
		id: +params.id,
	});

	if (!query.data) {
		return null;
	}

	const { category } = query.data;

	return (
		<Container>
			<Upsert action="edit" category={category} />
		</Container>
	);
}
