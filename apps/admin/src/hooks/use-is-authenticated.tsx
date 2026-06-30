import { authClient } from '@/lib/auth';

export function useIsAuthenticated() {
	const session = authClient.useSession();
	return !session.isPending && session.data?.user != null;
}
