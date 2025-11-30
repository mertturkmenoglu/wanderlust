import type { Outputs } from '@/lib/orpc';

export function useTripIsPrivileged(
	trip: Outputs['trips']['get']['trip'],
	userId: string,
) {
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
