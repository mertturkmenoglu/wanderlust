import { ReloadIcon } from '@radix-ui/react-icons';
import { useMutation } from '@tanstack/react-query';
import { Link, useLoaderData } from '@tanstack/react-router';
import { Button } from '@wanderlust/ui/components/button';
import { toast } from 'sonner';
import { useInvalidator } from '@/hooks/use-invalidator';
import { orpc } from '@/lib/orpc';

export function ActionButtons() {
	const { profile, meta } = useLoaderData({
		from: '/u/$username',
	});

	const invalidate = useInvalidator();

	const mutation = useMutation(
		orpc.users.follow.mutationOptions({
			onSettled: async () => {
				await invalidate();
				toast.success(meta.isFollowing ? 'Unfollowed' : 'Followed');
			},
		}),
	);

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
