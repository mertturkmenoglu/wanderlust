import { createFileRoute } from '@tanstack/react-router';
import { Container } from '@/components/container';
import { ensureData, getDefaultStaticData } from '@/lib/defaults';
import { addressesResource as r } from '@/resources/addresses';
import { Upsert } from '../-upsert';

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
		<Container title={address.line1}>
			<Upsert action="edit" entity={address} />
		</Container>
	);
}
