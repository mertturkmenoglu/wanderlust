import { createFileRoute } from '@tanstack/react-router';
import { renderer } from '@/components/details/renderer';
import { Show } from '@/components/show';
import { ensureData, getDefaultStaticData } from '@/lib/defaults';
import { defineRows } from '@/lib/define-rows';
import { categoriesResource as r } from '@/resources/categories';

export const Route = createFileRoute('/dashboard/categories/$id')({
	component: RouteComponent,
	loader: async ({ params, context }) => {
		return ensureData(r, context.qc, {
			input: {
				id: +params.id,
			},
		});
	},
	staticData: getDefaultStaticData(r, 'details'),
});

function RouteComponent() {
	const { category } = Route.useLoaderData();

	const rows = defineRows([
		['ID', category.id.toString()],
		['Name', category.name],
		['Image', renderer.Image(category.image)],
	]);

	return (
		<Show
			resource={r}
			input={{
				id: category.id,
			}}
			deleteInput={{
				id: category.id,
			}}
			rows={rows}
			data={category}
		/>
	);
}
