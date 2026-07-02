import { createFileRoute } from '@tanstack/react-router';
import { Container } from '@/components/container';
import { renderer } from '@/components/details/renderer';
import { Show } from '@/components/show';
import { defineRows } from '@/lib/define-rows';
import { accoladesResource } from '@/resources/accolades';

export const Route = createFileRoute('/dashboard/accolades/$id/')({
	component: RouteComponent,
	staticData: {
		breadcrumb: 'Accolade Details',
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

	const rows = defineRows([
		['ID', accolade.id],
		['Title', accolade.title],
		['Description', accolade.description],
		['Image', renderer.Image(accolade.image)],
		['Badge', renderer.Image(accolade.badge)],
		['Created At', renderer.Date(accolade.createdAt)],
		['Updated At', renderer.Date(accolade.updatedAt)],
	]);

	return (
		<Container>
			<Show
				resource={accoladesResource}
				input={{
					id: accolade.id,
				}}
				deleteInput={{
					id: accolade.id,
				}}
				rows={rows}
			/>
		</Container>
	);
}
