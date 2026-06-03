import { Skeleton } from '@wanderlust/ui/components/skeleton';
import { AppBanner } from '@/components/banner/common';
import { QuickActions } from '@/components/quick-actions';
import { authClient } from '@/lib/auth';

export function Banner() {
	const session = authClient.useSession();
	const isAuthenticated = !session.isPending && session.data !== null;

	if (session.isPending) {
		return <Skeleton className="my-8 h-64 w-full" />;
	}

	if (isAuthenticated) {
		return <QuickActions className="mt-4 md:mt-8" />;
	}

	return <AppBanner />;
}
