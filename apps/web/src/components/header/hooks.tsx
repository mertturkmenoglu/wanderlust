import { useMutation } from '@tanstack/react-query';
import { useMemo } from 'react';
import { authClient } from '@/lib/auth';

export function useIsImpersonating() {
	const session = authClient.useSession();
	const isImpersonating =
		session.data && session.data.session.impersonatedBy !== null;

	return isImpersonating;
}

export function useSignOutMutation() {
	return useMutation({
		mutationKey: ['sign-out'],
		mutationFn: async () => {
			await authClient.signOut({
				fetchOptions: {
					throw: true,
				},
			});
		},
		onSuccess: () => {
			globalThis.window.location.href = '/';
		},
	});
}

export function useShortName(fullName: string, maxLength = 15): string {
	const shortName = useMemo(() => {
		if (fullName.length > maxLength) {
			return `${fullName.slice(0, maxLength)}...`;
		}
		return fullName;
	}, [fullName, maxLength]);

	return shortName;
}
