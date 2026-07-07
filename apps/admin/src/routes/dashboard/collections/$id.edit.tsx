import { createFileRoute } from '@tanstack/react-router';
import { EditDialog } from '@/components/edit-dialog';
import { ensureData, getDefaultStaticData } from '@/lib/defaults';
import { collectionsResource as r } from '@/resources/collections';
import { Upsert } from './-upsert';

export const Route = createFileRoute('/dashboard/collections/$id/edit')({
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
	const { collection } = Route.useLoaderData();

	return (
		<EditDialog id={collection.id} resource={r}>
			<Upsert action="edit" entity={collection} />
		</EditDialog>
	);
}
