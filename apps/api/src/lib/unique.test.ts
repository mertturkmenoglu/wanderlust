import { describe, expect, test } from 'vitest';
import { unique } from './unique';

describe('unique function', () => {
	test('should return empty array given an empty array', () => {
		const input: unknown[] = [];
		const result = unique(input);
		expect(result).toEqual([]);
	});

	test('should return the same array given an array with unique elements', () => {
		const input = [1, 2, 3];
		const result = unique(input);
		expect(result).toEqual([1, 2, 3]);
	});

	test('should return an array with unique elements given an array with duplicates', () => {
		const input = [1, 2, 2, 3, 3, 3];
		const result = unique(input);
		expect(result).toEqual([1, 2, 3]);
	});

	test('should handle arrays with different types of elements', () => {
		const input = [1, '1', 2, '2', 1, '1'];
		const result = unique(input);
		expect(result).toEqual([1, '1', 2, '2']);
	});

	test('should handle arrays with objects', () => {
		const obj1 = { a: 1 };
		const obj2 = { a: 1 };
		const input = [obj1, obj2, obj1];
		const result = unique(input);
		expect(result).toEqual([obj1, obj2]);
	});

	test('should handle iterables other than arrays', () => {
		const input = new Set([1, 2, 2, 3]);
		const result = unique(input);
		expect(result).toEqual([1, 2, 3]);
	});
});
