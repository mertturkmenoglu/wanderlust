import { describe, expect, test } from 'vitest';
import { interleave } from './interleave';

describe('Lib/Interleave', () => {
	test('Empty A and Empty B should return empty array', () => {
		const A: unknown[] = [];
		const B: unknown[] = [];
		const result = interleave(A, B);
		expect(result).toEqual([]);
	});

	test('Non empty A and Empty B should return A', () => {
		const A = [1, 2, 3];
		const B: unknown[] = [];
		const result = interleave(A, B);
		expect(result).toEqual(A);
	});

	test('Empty A and Non empty B should return B', () => {
		const A: unknown[] = [];
		const B = [4, 5, 6];
		const result = interleave(A, B);
		expect(result).toEqual(B);
	});

	test('Non empty A and Non empty B should return interleaved array', () => {
		const A = [1, 2, 3];
		const B = [3, 4, 5];
		const result = interleave(A, B);
		expect(result).toEqual([1, 3, 2, 4, 3, 5]);
	});

	test('A longer than B should return interleaved array with remaining A elements', () => {
		const A = [1, 2, 3, 4, 5];
		const B = [6, 7];
		const result = interleave(A, B);
		expect(result).toEqual([1, 6, 2, 7, 3, 4, 5]);
	});

	test('A shorter than B should return interleaved array with remaining B elements', () => {
		const A = [1, 2];
		const B = [3, 4, 5, 6];
		const result = interleave(A, B);
		expect(result).toEqual([1, 3, 2, 4, 5, 6]);
	});
});
