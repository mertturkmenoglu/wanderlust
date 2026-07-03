import { createFileRoute } from '@tanstack/react-router';
import { Container } from '@/components/container';
import { ensureData, getDefaultStaticData } from '@/lib/defaults';
import { accoladesResource as r } from '@/resources/accolades';
import { Upsert } from '../-upsert';

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
		<Container title={accolade.title}>
			<Upsert action="edit" entity={accolade} />
		</Container>
	);
}
