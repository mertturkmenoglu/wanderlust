import { createFileRoute } from '@tanstack/react-router';
import { UpsertCollection } from '../../-upsert';

export const Route = createFileRoute('/dashboard/collections/$id/edit/')(
	{
		component: RouteComponent,
		loader: ({ context, params }) => {
			return context.queryClient.ensureQueryData(
				context.orpc.collections.get.queryOptions({
					input: {
						id: params.id,
					},
				}),
			);
		},
	},
);

function RouteComponent() {
	const { collection } = Route.useLoaderData();
	return <UpsertCollection action="edit" collection={collection} />;
}
