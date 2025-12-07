import { createFileRoute, Link } from '@tanstack/react-router';
import { AppMessage } from '@/components/app-message';
import { UserImage } from '@/components/user-image';
import { userImage } from '@/lib/image';
import { ipx } from '@/lib/ipx';

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
			{followers.length === 0 && (
				<AppMessage
					emptyMessage="This user has no followers yet"
					showBackButton={false}
				/>
			)}

			{followers.length > 0 && (
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
					{followers.map((follower) => (
						<Link
							to="/u/$username"
							params={{ username: follower.username }}
							key={follower.id}
							className="flex items-center gap-4 rounded-md p-2 hover:bg-muted"
						>
							<UserImage
								src={ipx(userImage(follower.image), 'w_512')}
								className="size-32"
							/>
							<div>
								<div className="text-lg">{follower.name}</div>
								<div className="text-muted-foreground">
									@{follower.username}
								</div>
							</div>
						</Link>
					))}
				</div>
			)}
		</div>
	);
}
