import type { components } from '@/lib/api-types';

export function useTripIsPrivileged(
  trip: components['schemas']['Trip'],
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
