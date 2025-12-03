import { createFileRoute, Link } from '@tanstack/react-router';
import { AppMessage } from '@/components/blocks/app-message';
import { BackLink } from '@/components/blocks/back-link';
import { PlaceCard } from '@/components/blocks/place-card';
import { Separator } from '@/components/ui/separator';
import { authGuard } from '@/lib/auth';
import { Menu } from './-components/menu';

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
	const { auth } = Route.useRouteContext();
	const isOwner = auth.user.id === list.userId;
	const isEmpty = list.items.length === 0;

	return (
		<div className="mx-auto my-8 max-w-7xl">
			<BackLink href="/lists" text="Go back to lists" />
			<div className="flex items-center justify-between gap-8">
				<div>
					<h2 className="text-2xl tracking-tighter">{list.name}</h2>
					<div className="mt-1 flex items-center gap-2 text-muted-foreground text-xs">
						<div>Created by: {list.user.name}</div>
						<div>{new Date(list.createdAt).toLocaleDateString()}</div>
					</div>
					<div className="mt-1 text-muted-foreground text-xs" />
				</div>
				<Menu listId={list.id} isOwner={isOwner} />
			</div>

			<Separator className="my-2" />

			{isEmpty && (
				<AppMessage
					emptyMessage="This list is empty"
					className="my-16"
					backLink="/lists"
					backLinkText="Go back to the lists page"
				/>
			)}

			{!isEmpty && (
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
					{list.items.map((listItem) => (
						<Link
							to="/p/$id"
							params={{
								id: listItem.placeId,
							}}
							key={listItem.placeId}
						>
							<PlaceCard place={listItem.place} />
						</Link>
					))}
				</div>
			)}
		</div>
	);
}
