import { createFileRoute, Link } from '@tanstack/react-router';
import { AppMessage } from '@/components/blocks/app-message';
import { UserImage } from '@/components/blocks/user-image';
import { userImage } from '@/lib/image';
import { ipx } from '@/lib/ipx';

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
			{following.length === 0 && (
				<AppMessage
					emptyMessage="This user hasn't followed anyone yet"
					showBackButton={false}
				/>
			)}

			{following.length > 0 && (
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
					{following.map((following) => (
						<Link
							to="/u/$username"
							params={{ username: following.username }}
							key={following.id}
							className="flex items-center gap-4 rounded-md p-2 hover:bg-muted"
						>
							<UserImage
								src={ipx(userImage(following.image), 'w_512')}
								className="size-32"
							/>
							<div>
								<div className="text-lg">{following.name}</div>
								<div className="text-muted-foreground">
									@{following.username}
								</div>
							</div>
						</Link>
					))}
				</div>
			)}
		</div>
	);
}
