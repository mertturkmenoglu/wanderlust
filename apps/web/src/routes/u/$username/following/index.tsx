import { createFileRoute } from '@tanstack/react-router';
import { ItemGroup } from '@wanderlust/ui/components/item';
import { EmptyState } from './-components/empty';
import { FollowingItem } from './-components/item';

export const Route = createFileRoute('/u/$username/following/')({
	component: RouteComponent,
	loader: ({ context, params }) => {
		return context.queryClient.ensureQueryData(
			context.orpc.users.listFollowing.queryOptions({
				input: {
					username: params.username,
					page: 1,
					pageSize: 100,
				},
			}),
		);
	},
});

function RouteComponent() {
	const { following } = Route.useLoaderData();

	return (
		<div className="my-8">
			{following.length === 0 && <EmptyState />}

			{following.length > 0 && (
				<ItemGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					{following.map((following) => (
						<FollowingItem key={following.id} following={following} />
					))}
				</ItemGroup>
			)}
		</div>
	);
}
