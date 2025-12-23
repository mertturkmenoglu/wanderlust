import { ReloadIcon } from '@radix-ui/react-icons';
import { useMutation } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { Button } from '@wanderlust/ui/components/button';
import { Spinner } from '@wanderlust/ui/components/spinner';
import { toast } from 'sonner';
import { useInvalidator } from '@/hooks/use-invalidator';
import { orpc } from '@/lib/orpc';

type Props = {
	loading: boolean;
	isThisUser: boolean;
	isFollowing: boolean;
	username: string;
};

export function ActionButtons({
	loading,
	isThisUser,
	isFollowing,
	username,
}: Props) {
	const invalidate = useInvalidator();

	const mutation = useMutation(
		orpc.users.follow.mutationOptions({
			onSettled: async () => {
				await invalidate();
				toast.success(isFollowing ? 'Unfollowed' : 'Followed');
			},
		}),
	);

	function handleFollowClick() {
		mutation.mutate({
			username,
		});
	}

	if (loading) {
		return (
			<Button variant="outline">
				<Spinner />
			</Button>
		);
	}

	return (
		<div>
			{isThisUser ? (
				<Button asChild variant="outline">
					<Link to="/settings">Settings</Link>
				</Button>
			) : (
				<Button
					variant={isFollowing ? 'outline' : 'default'}
					onClick={handleFollowClick}
					disabled={mutation.isPending}
				>
					{isFollowing ? 'Following' : 'Follow'}
					{mutation.isPending && (
						<ReloadIcon className="ml-2 size-4 animate-spin" />
					)}
				</Button>
			)}
		</div>
	);
}
