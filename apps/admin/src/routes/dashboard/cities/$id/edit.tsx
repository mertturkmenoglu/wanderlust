import { createFileRoute } from '@tanstack/react-router';
import { Container } from '@/components/container';
import { ensureData, getDefaultStaticData } from '@/lib/defaults';
import { citiesResource as r } from '@/resources/cities';
import { Upsert } from '../-upsert';

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
		<Container title={city.name}>
			<Upsert action="edit" entity={city} />
		</Container>
	);
}
