import { createFileRoute } from '@tanstack/react-router';
import { Container } from '@/components/container';
import { renderer } from '@/components/details/renderer';
import { Show } from '@/components/show';
import { defineRows } from '@/lib/define-rows';
import { categoriesResource } from '@/resources/categories';

export const Route = createFileRoute('/dashboard/categories/$id/')({
	component: RouteComponent,
	staticData: {
		breadcrumb: 'Category Details',
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

	const rows = defineRows([
		['ID', category.id.toString()],
		['Name', category.name],
		['Image', renderer.Image(category.image)],
	]);

	return (
		<Container>
			<Show
				resource={categoriesResource}
				input={{
					id: category.id,
				}}
				deleteInput={{
					id: category.id,
				}}
				rows={rows}
			/>
		</Container>
	);
}
