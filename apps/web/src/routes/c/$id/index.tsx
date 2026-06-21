import { createFileRoute } from '@tanstack/react-router';
import { orpc } from '@/lib/orpc';
import { EmptyState } from './-empty';
import { Header } from './-header';
import { useCollectionQuery } from './-hooks';
import { Items } from './-items';

export const Route = createFileRoute('/c/$id/')({
	component: RouteComponent,
	loader: ({ context, params }) => {
		context.queryClient.prefetchQuery(
			orpc.collections.get.queryOptions({
				input: {
					id: params.id,
				},
			}),
		);
	},
});

function RouteComponent() {
	const query = useCollectionQuery();
	const { collection } = query.data;
	const isEmpty = collection.items.length === 0;

	return (
		<div className="mx-auto mt-8 w-full max-w-7xl md:mt-16">
			<Header />

			{isEmpty && <EmptyState />}

			<Items className="mt-8" />
		</div>
	);
}
