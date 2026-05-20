import type { InfiniteData } from '@tanstack/react-query';
import { useMemo } from 'react';

export function useFlattenedQuery<T, P, R>(
	data: InfiniteData<T, P> | undefined,
	flatFn: (page: T) => R[],
): R[] {
	return useMemo(() => {
		if (!data) {
			return [];
		}

		return data.pages.flatMap(flatFn);
	}, [data, flatFn]);
}
