import { useSuspenseQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { authClient } from '@/lib/auth';
import { orpc } from '@/lib/orpc';
import { usePlanTripDialogContext } from './context';

export function useNavigationGuard() {
	const ctx = usePlanTripDialogContext();
	const session = authClient.useSession();
	const navigate = useNavigate({ from: '/p/$id/' });

	useEffect(() => {
		if (ctx.open && !session.data?.user) {
			navigate({
				to: '/sign-in',
			});
		}
	}, [ctx.open, session.data?.user, navigate]);
}

export function useListTripsQuery() {
	const ctx = usePlanTripDialogContext();
	const session = authClient.useSession();

	return useSuspenseQuery(
		orpc.trips.list.queryOptions({
			input: {},
			enabled: !!session.data?.user && ctx.open,
		}),
	);
}
