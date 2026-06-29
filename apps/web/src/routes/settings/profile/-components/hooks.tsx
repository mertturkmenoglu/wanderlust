import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useInvalidator } from '@/hooks/use-invalidator';
import { authClient } from '@/lib/auth';
import { orpc } from '@/lib/orpc';

export function useUpdateUserProfileMutation() {
	const invalidate = useInvalidator();

	return useMutation(
		orpc.users.update.mutationOptions({
			onSuccess: async (newUser) => {
				await invalidate();

				await authClient.updateUser({
					bio: newUser.profile.bio,
					image: newUser.profile.image ?? undefined,
					name: newUser.profile.name,
					username: newUser.profile.username,
					website: newUser.profile.website,
				});

				toast.success('Profile updated');
			},
		}),
	);
}

export function useUpdateUserImageMutation() {
	return useMutation(
		orpc.users.updateImage.mutationOptions({
			onSuccess: async (res) => {
				await authClient.updateUser({
					image: res.profile.image,
				});

				toast.success('Image updated');

				globalThis.window.location.reload();
			},
		}),
	);
}
