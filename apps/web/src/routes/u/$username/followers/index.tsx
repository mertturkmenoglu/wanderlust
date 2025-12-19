import { createFileRoute } from '@tanstack/react-router';
import { ItemGroup } from '@wanderlust/ui/components/item';
import { EmptyState } from './-components/empty';
import { FollowersItem } from './-components/item';

export const Route = createFileRoute('/u/$username/followers/')({
	component: RouteComponent,
	loader: ({ context, params }) => {
		return context.queryClient.ensureQueryData(
			context.orpc.users.listFollowers.queryOptions({
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
	const { followers } = Route.useLoaderData();

	return (
		<div className="my-8">
			{followers.length === 0 && <EmptyState />}

			{followers.length > 0 && (
				<ItemGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					{followers.map((follower) => (
						<FollowersItem key={follower.id} follower={follower} />
					))}
				</ItemGroup>
			)}
		</div>
	);
}
