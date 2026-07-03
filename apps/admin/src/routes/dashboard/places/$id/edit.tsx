import { createFileRoute } from '@tanstack/react-router';
import { Container } from '@/components/container';
import { ensureData, getDefaultStaticData } from '@/lib/defaults';
import { placesResource as r } from '@/resources/places';

export const Route = createFileRoute('/dashboard/places/$id/edit')({
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
	const { place } = Route.useLoaderData();

	return (
		<Container title={place.name}>
			<div>Work in progress</div>
		</Container>
	);
}
