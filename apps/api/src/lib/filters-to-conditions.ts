import type { Filter } from '@wanderlust/common';

export function transformFiltersToConditions(
	filters: Filter.Info['filters'] | undefined,
): Record<string, Record<string, unknown>>[] {
	if (!filters) {
		return [];
	}

	return filters.map((f) => ({
		[f.field]: {
			[f.operator]: f.value,
		},
	}));
}
