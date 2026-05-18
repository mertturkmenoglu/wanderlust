import { createFileRoute } from '@tanstack/react-router';
import { Separator } from '@wanderlust/ui/components/separator';
import { authGuard } from '@/lib/auth';
import { ListContextProvider } from './-context';
import { EmptyState } from './-empty';
import { Header } from './-header';
import { Items } from './-items';

export const Route = createFileRoute('/lists/$id/')({
	component: RouteComponent,
	beforeLoad: authGuard,
	loader: ({ context, params }) => {
		return context.queryClient.ensureQueryData(
			context.orpc.lists.get.queryOptions({
				input: {
					id: params.id,
				},
			}),
		);
	},
});

function RouteComponent() {
	const { list } = Route.useLoaderData();
	const isEmpty = list.items.length === 0;

	return (
		<ListContextProvider>
			<div className="mx-auto my-8 max-w-7xl">
				<Header />

				<Separator className="mb-2" />

				{isEmpty && <EmptyState />}

				{!isEmpty && <Items />}
			</div>
		</ListContextProvider>
	);
}
