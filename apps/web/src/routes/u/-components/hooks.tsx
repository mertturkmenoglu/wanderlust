import { useMutation } from '@tanstack/react-query';
import { linkOptions, useLoaderData } from '@tanstack/react-router';
import { toast } from 'sonner';
import { useInvalidator } from '@/hooks/use-invalidator';
import { orpc } from '@/lib/orpc';

export function useTabs(username: string) {
	return [
		linkOptions({
			to: '/u/$username',
			params: { username },
			title: 'Profile',
		}),
		linkOptions({
			to: '/u/$username/activities',
			params: { username },
			title: 'Activities',
		}),
		linkOptions({
			to: '/u/$username/reviews',
			params: { username },
			title: 'Reviews',
		}),
		linkOptions({
			to: '/u/$username/lists',
			params: { username },
			title: 'Lists',
		}),
		linkOptions({
			to: '/u/$username/favorites',
			params: { username },
			title: 'Favorites',
		}),
	];
}

export function useFollowMutation() {
	const { meta } = useLoaderData({ from: '/u/$username' });
	const invalidate = useInvalidator();

	return useMutation(
		orpc.users.follow.mutationOptions({
			onSettled: async () => {
				await invalidate();
				toast.success(meta.isFollowing ? 'Unfollowed' : 'Followed');
			},
		}),
	);
}
