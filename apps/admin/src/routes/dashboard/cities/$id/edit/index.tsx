import { createFileRoute } from '@tanstack/react-router';
import { Upsert } from '../../-upsert';

export const Route = createFileRoute('/dashboard/cities/$id/edit/')({
	component: RouteComponent,
	loader: ({ context, params }) =>
		context.queryClient.ensureQueryData(
			context.orpc.cities.get.queryOptions({
				input: {
					id: +params.id,
				},
			}),
		),
});

function RouteComponent() {
	const { city } = Route.useLoaderData();

	return <Upsert action="edit" city={city} />;
}
