import { createFileRoute } from '@tanstack/react-router';
import { renderer } from '@/components/details/renderer';
import { Show } from '@/components/show';
import { ensureData, getDefaultStaticData } from '@/lib/defaults';
import { defineRows } from '@/lib/define-rows';
import { accoladesResource as r } from '@/resources/accolades';

export const Route = createFileRoute('/dashboard/accolades/$id/')({
	component: RouteComponent,
	loader: async ({ params, context }) => {
		return ensureData(r, context.qc, {
			input: {
				id: params.id,
			},
		});
	},
	staticData: getDefaultStaticData(r, 'details'),
});

function RouteComponent() {
	const { accolade } = Route.useLoaderData();

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
		<Show
			resource={r}
			input={{
				id: accolade.id,
			}}
			deleteInput={{
				id: accolade.id,
			}}
			rows={rows}
			data={accolade}
		/>
	);
}
