import { useInfiniteQuery } from '@tanstack/react-query';
import { GlobeIcon, LockIcon, UsersIcon } from 'lucide-react';
import { orpc } from '@/lib/orpc';
import type { TVisibilityLevel } from './-types';

export function useMyTripsQuery() {
	return useInfiniteQuery(
		orpc.trips.list.infiniteOptions({
			input: (page) => ({
				page,
				pageSize: 10,
			}),
			initialPageParam: 1,
			getNextPageParam: (last) =>
				last.pagination.hasNext ? last.pagination.page + 1 : undefined,
		}),
	);
}

export function useVisibilityLevelIcon(lvl: TVisibilityLevel) {
	if (lvl === 'public') {
		return GlobeIcon;
	}

	if (lvl === 'friends') {
		return UsersIcon;
	}

	return LockIcon;
}

export function useVisibilityLevelTooltip(lvl: TVisibilityLevel) {
	if (lvl === 'public') {
		return 'Everyone can see this trip';
	}

	if (lvl === 'friends') {
		return 'Only participants can see this trip';
	}

	return 'Only you can see this trip';
}
