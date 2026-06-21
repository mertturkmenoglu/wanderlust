import { ReloadIcon } from '@radix-ui/react-icons';
import { Link, useLoaderData } from '@tanstack/react-router';
import { Button, buttonVariants } from '@wanderlust/ui/components/button';
import { SendIcon } from 'lucide-react';
import { useFollowMutation } from './hooks';

export function ActionButtons() {
	const { profile, meta } = useLoaderData({
		from: '/u/$username',
	});

	const mutation = useFollowMutation();

	return (
		<div className="flex items-center gap-2">
			{meta.isSelf ? (
				<Link to="/settings" className={buttonVariants({ variant: 'outline' })}>
					Settings
				</Link>
			) : (
				<>
					{meta.isFollowing && (
						<Link
							to="/chat"
							className={buttonVariants({
								variant: 'midnight',
								size: 'default',
							})}
						>
							<SendIcon />
							<span className="">Chat</span>
						</Link>
					)}
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
				</>
			)}
		</div>
	);
}
