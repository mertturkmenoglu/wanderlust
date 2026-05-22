import { ReloadIcon } from '@radix-ui/react-icons';
import { Link, useLoaderData } from '@tanstack/react-router';
import { Button } from '@wanderlust/ui/components/button';
import { useFollowMutation } from './hooks';

export function ActionButtons() {
	const { profile, meta } = useLoaderData({
		from: '/u/$username',
	});

	const mutation = useFollowMutation();

	return (
		<div>
			{meta.isSelf ? (
				<Button asChild variant="outline">
					<Link to="/settings">Settings</Link>
				</Button>
			) : (
				<Button
					variant={meta.isFollowing ? 'outline' : 'default'}
					onClick={() => {
						mutation.mutate({
							username: profile.username,
						});
					}}
					disabled={mutation.isPending}
				>
					{meta.isFollowing ? 'Following' : 'Follow'}
					{mutation.isPending && (
						<ReloadIcon className="ml-2 size-4 animate-spin" />
					)}
				</Button>
			)}
		</div>
	);
}
