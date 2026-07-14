import type { Filter as FilterNs } from '@wanderlust/common';
import { describe, expect, test } from 'vitest';
import { transformFiltersToConditions } from './filters-to-conditions';

type Filter = FilterNs.Info['filters'][number];

describe('filtersToConditions', () => {
	test('should return empty array given undefined filters', () => {
		const input: Filter[] | undefined = undefined;
		const result = transformFiltersToConditions(input);
		expect(result).toEqual([]);
	});

	test('should handle "eq" operator', () => {
		const input: Filter[] = [{ field: 'name', operator: 'eq', value: 'John' }];
		const result = transformFiltersToConditions(input);
		expect(result).toEqual([{ name: { eq: 'John' } }]);
	});

	test('should handle "gt" operator', () => {
		const input: Filter[] = [{ field: 'age', operator: 'gt', value: 30 }];
		const result = transformFiltersToConditions(input);
		expect(result).toEqual([{ age: { gt: 30 } }]);
	});

	test('should handle "gte" operator', () => {
		const input: Filter[] = [{ field: 'age', operator: 'gte', value: 30 }];
		const result = transformFiltersToConditions(input);
		expect(result).toEqual([{ age: { gte: 30 } }]);
	});

	test('should handle "ilike" operator', () => {
		const input: Filter[] = [
			{ field: 'name', operator: 'ilike', value: 'John' },
		];
		const result = transformFiltersToConditions(input);
		expect(result).toEqual([{ name: { ilike: '%John%' } }]);
	});

	test('should handle "in" operator', () => {
		const input: Filter[] = [
			{ field: 'age', operator: 'in', value: [25, 30, 35] },
		];
		const result = transformFiltersToConditions(input);
		expect(result).toEqual([{ age: { in: [25, 30, 35] } }]);
	});

	test('should handle "like" operator', () => {
		const input: Filter[] = [
			{ field: 'name', operator: 'like', value: 'John' },
		];
		const result = transformFiltersToConditions(input);
		expect(result).toEqual([{ name: { like: '%John%' } }]);
	});

	test('should handle "lt" operator', () => {
		const input: Filter[] = [{ field: 'age', operator: 'lt', value: 30 }];
		const result = transformFiltersToConditions(input);
		expect(result).toEqual([{ age: { lt: 30 } }]);
	});

	test('should handle "lte" operator', () => {
		const input: Filter[] = [{ field: 'age', operator: 'lte', value: 30 }];
		const result = transformFiltersToConditions(input);
		expect(result).toEqual([{ age: { lte: 30 } }]);
	});

	test('should handle "ne" operator', () => {
		const input: Filter[] = [{ field: 'age', operator: 'ne', value: 30 }];
		const result = transformFiltersToConditions(input);
		expect(result).toEqual([{ age: { ne: 30 } }]);
	});

	test('should handle "notIn" operator', () => {
		const input: Filter[] = [
			{ field: 'age', operator: 'notIn', value: [25, 30, 35] },
		];
		const result = transformFiltersToConditions(input);
		expect(result).toEqual([{ age: { notIn: [25, 30, 35] } }]);
	});

	test('should handle multiple filters', () => {
		const input: Filter[] = [
			{ field: 'name', operator: 'eq', value: 'John' },
			{ field: 'age', operator: 'gt', value: 30 },
		];
		const result = transformFiltersToConditions(input);
		expect(result).toEqual([{ name: { eq: 'John' } }, { age: { gt: 30 } }]);
	});
});
