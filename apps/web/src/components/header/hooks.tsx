import { authClient } from '@/lib/auth';

export function useIsImpersonating() {
	const session = authClient.useSession();
	const isImpersonating =
		session.data && session.data.session.impersonatedBy !== null;

	return isImpersonating;
}
