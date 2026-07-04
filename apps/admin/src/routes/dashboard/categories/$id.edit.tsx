import { createFileRoute } from '@tanstack/react-router';
import { EditDialog } from '@/components/edit-dialog';
import { ensureData, getDefaultStaticData } from '@/lib/defaults';
import { categoriesResource as r } from '@/resources/categories';
import { Upsert } from './-upsert';

export const Route = createFileRoute('/dashboard/categories/$id/edit')({
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
	const { category } = Route.useLoaderData();

	return (
		<EditDialog id={category.id.toString()} resource={r}>
			<Upsert action="edit" entity={category} />
		</EditDialog>
	);
}
