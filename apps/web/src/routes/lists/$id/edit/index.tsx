import { createFileRoute } from '@tanstack/react-router';
import { BackLink } from '@/components/blocks/back-link';
import { Separator } from '@/components/ui/separator';
import { authGuard } from '@/lib/auth';
import { EditInfo } from './-components/edit-info';
import { EditItems } from './-components/edit-items';

export const Route = createFileRoute('/lists/$id/edit/')({
	component: RouteComponent,
	beforeLoad: authGuard,
	loader: ({ context, params }) =>
		context.queryClient.ensureQueryData(
			context.orpc.lists.get.queryOptions({
				input: {
					id: params.id,
				},
			}),
		),
});

function RouteComponent() {
	const { list } = Route.useLoaderData();

	return (
		<div className="mx-auto my-8 max-w-7xl">
			<BackLink href={`/lists/${list.id}`} text="Go back to the list page" />
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-2xl tracking-tighter">Editing: {list.name}</h2>
					<div className="mt-1 flex items-center gap-2 text-muted-foreground text-xs">
						<div>Created by: {list.user.name}</div>
						<div>{new Date(list.createdAt).toLocaleDateString()}</div>
					</div>
				</div>
			</div>

			<EditInfo className="my-4" />

			<Separator className="my-4" />

			<EditItems className="my-4" />
		</div>
	);
}
