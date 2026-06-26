import { useLoaderData, useRouteContext } from '@tanstack/react-router';
import type { Outputs } from '@/lib/orpc';

type Trip = Outputs['trips']['get']['trip'];

type Options =
	| {
			trip: Trip;
			userId: string;
	  }
	| undefined;

/**
 * This hook checks if the current user is privileged (owner or editor) for the given trip.
 * If no options are provided, it will use the trip and userId from the route context.
 */
export function useTripIsPrivileged(options?: Options) {
	const { trip: tripFromRouter } = useLoaderData({ from: '/trips/$id' });
	const { auth: authFromRouter } = useRouteContext({ from: '/trips/$id' });

	const trip = options?.trip ?? tripFromRouter;
	const userId = options?.userId ?? authFromRouter.user?.id ?? '';

	if (trip.ownerId === userId) {
		return true;
	}

	for (const p of trip.participants) {
		if (p.id === userId && p.role === 'editor') {
			return true;
		}
	}

	return false;
}
