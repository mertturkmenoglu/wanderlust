import type { Filter } from '@wanderlust/common';

export function transformFiltersToConditions(
	filters: Filter.Info['filters'] | undefined,
): Record<string, Record<string, unknown>>[] {
	if (!filters) {
		return [];
	}

	return filters.map((f) => {
		const isLikeOrILikeOperator =
			f.operator === 'like' || f.operator === 'ilike';
		const isStringValue = typeof f.value === 'string';
		const shouldWrapValue = isLikeOrILikeOperator && isStringValue;
		const value = shouldWrapValue ? `%${f.value}%` : f.value;

		return {
			[f.field]: {
				[f.operator]: value,
			},
		};
	});
}
