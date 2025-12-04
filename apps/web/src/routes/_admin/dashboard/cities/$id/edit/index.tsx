import { createFileRoute } from '@tanstack/react-router';
import { UpsertCity } from '../../-upsert';

export const Route = createFileRoute('/_admin/dashboard/cities/$id/edit/')({
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

	return <UpsertCity action="edit" city={city} />;
}
