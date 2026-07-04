import { createFileRoute } from '@tanstack/react-router';
import { EditDialog } from '@/components/edit-dialog';
import { ensureData, getDefaultStaticData } from '@/lib/defaults';
import { accoladesResource as r } from '@/resources/accolades';
import { Upsert } from './-upsert';

export const Route = createFileRoute('/dashboard/accolades/$id/edit')({
	component: RouteComponent,
	loader: async ({ params, context }) => {
		return ensureData(r, context.qc, {
			input: {
				id: params.id,
			},
		});
	},
	staticData: getDefaultStaticData(r, 'edit'),
});

function RouteComponent() {
	const { accolade } = Route.useLoaderData();

	return (
		<EditDialog id={accolade.id} resource={r}>
			<Upsert action="edit" entity={accolade} />
		</EditDialog>
	);
}
