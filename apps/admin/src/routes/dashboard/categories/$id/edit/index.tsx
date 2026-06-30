import { createFileRoute, notFound } from '@tanstack/react-router';
import { Container } from '@/components/container';
import { orpc } from '@/lib/orpc';
import { Upsert } from '../../-components/upsert';

export const Route = createFileRoute('/dashboard/categories/$id/edit/')({
	component: RouteComponent,
	loader: async ({ params }) => {
		const res = await orpc.categories.list.call({});
		const category = res.categories.find((c) => c.id === +params.id);

		if (!category) {
			throw notFound();
		}

		return {
			category,
		};
	},
	staticData: {
		breadcrumb: 'Edit Category',
	},
});

function RouteComponent() {
	const { category } = Route.useLoaderData();

	return (
		<Container>
			<Upsert action="edit" category={category} />
		</Container>
	);
}
