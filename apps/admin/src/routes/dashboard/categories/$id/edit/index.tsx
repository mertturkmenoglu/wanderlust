import { createFileRoute, notFound } from '@tanstack/react-router';
import { Upsert } from '../../-upsert';

export const Route = createFileRoute('/dashboard/categories/$id/edit/')({
	component: RouteComponent,
	loader: async ({ context, params }) => {
		const res = await context.orpc.categories.list.call({});
		const category = res.categories.find((c) => c.id === +params.id);

		if (!category) {
			throw notFound();
		}

		return {
			category,
		};
	},
});

function RouteComponent() {
	const { category } = Route.useLoaderData();

	return <Upsert action="edit" category={category} />;
}
