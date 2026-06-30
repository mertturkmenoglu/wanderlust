import { createFileRoute } from '@tanstack/react-router';
import { Container } from '@/components/container';
import { orpc } from '@/lib/orpc';
import { Upsert } from '../../-components/upsert';

export const Route = createFileRoute('/dashboard/cities/$id/edit/')({
	component: RouteComponent,
	loader: async ({ params, context }) => {
		return context.queryClient.ensureQueryData(
			orpc.cities.get.queryOptions({ input: { id: +params.id } }),
		);
	},
	staticData: {
		breadcrumb: 'Edit City',
	},
});

function RouteComponent() {
	const { city } = Route.useLoaderData();

	return (
		<Container>
			<Upsert action="edit" city={city} />
		</Container>
	);
}
