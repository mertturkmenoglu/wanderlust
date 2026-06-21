import { createFileRoute } from '@tanstack/react-router';
import { BackLink } from '@/components/back-link';
import { authGuard } from '@/lib/auth';
import { orpc } from '@/lib/orpc';
import { DateInfo } from './-date-info';
import { EditInfo } from './-edit-info';
import { EditItems } from './-edit-items';
import { useListQuery } from './-hooks';

export const Route = createFileRoute('/lists/$id/edit/')({
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

	return (
		<div className="mx-auto my-8 w-full max-w-7xl">
			<BackLink
				to="/lists/$id"
				params={{
					id: list.id,
				}}
				text="Go back to the list page"
			/>

			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-2xl tracking-tighter">Editing: {list.name}</h2>
					<DateInfo className="mt-1" />
				</div>
			</div>

			<div className="mt-4 flex flex-col gap-4 md:flex-row">
				<EditInfo className="flex-1/3" />

				<EditItems className="flex-2/3" />
			</div>
		</div>
	);
}
