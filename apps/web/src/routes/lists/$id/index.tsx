import { createFileRoute } from '@tanstack/react-router';
import { Separator } from '@wanderlust/ui/components/separator';
import { authGuard } from '@/lib/auth';
import { orpc } from '@/lib/orpc';
import { ListContextProvider } from './-context';
import { EmptyState } from './-empty';
import { Header } from './-header';
import { useListQuery } from './-hooks';
import { Items } from './-items';

export const Route = createFileRoute('/lists/$id/')({
	component: RouteComponent,
	beforeLoad: authGuard,
	loader: ({ context, params }) => {
		context.queryClient.prefetchQuery(
			orpc.lists.get.queryOptions({
				input: {
					id: params.id,
				},
			}),
		);
	},
});

function RouteComponent() {
	const query = useListQuery();
	const { list } = query.data;
	const isEmpty = list.items.length === 0;

	return (
		<ListContextProvider>
			<div className="mx-auto my-8 w-full max-w-7xl">
				<Header />

				<Separator className="my-2 md:my-0" />

				{isEmpty && <EmptyState />}

				{!isEmpty && <Items />}
			</div>
		</ListContextProvider>
	);
}
