import { createFileRoute } from '@tanstack/react-router';
import { EditDialog } from '@/components/edit-dialog';
import { ensureData, getDefaultStaticData } from '@/lib/defaults';
import { citiesResource as r } from '@/resources/cities';
import { Upsert } from './-upsert';

export const Route = createFileRoute('/dashboard/cities/$id/edit')({
	component: RouteComponent,
	loader: async ({ params, context }) => {
		return ensureData(r, context.qc, {
			input: {
				id: +params.id,
			},
		});
	},
	staticData: getDefaultStaticData(r, 'edit'),
});

function RouteComponent() {
	const { city } = Route.useLoaderData();

	return (
		<EditDialog id={city.id.toString()} resource={r}>
			<Upsert action="edit" entity={city} />
		</EditDialog>
	);
}
