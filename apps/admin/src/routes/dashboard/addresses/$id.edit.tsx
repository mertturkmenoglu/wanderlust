import { createFileRoute } from '@tanstack/react-router';
import { EditDialog } from '@/components/edit-dialog';
import { ensureData, getDefaultStaticData } from '@/lib/defaults';
import { addressesResource as r } from '@/resources/addresses';
import { Upsert } from './-upsert';

export const Route = createFileRoute('/dashboard/addresses/$id/edit')({
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
	const { address } = Route.useLoaderData();

	return (
		<EditDialog id={address.id.toString()} resource={r}>
			<Upsert action="edit" entity={address} />
		</EditDialog>
	);
}
