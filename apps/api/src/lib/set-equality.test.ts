import { describe, expect, test } from 'vitest';
import { areSetsEqual } from './set-equality';

describe('Set Equality', () => {
	test('A=Empty B=Empty should return true', () => {
		const a = new Set();
		const b = new Set();
		expect(areSetsEqual(a, b)).toBe(true);
	});

	test('A=Empty B=Non-Empty should return false', () => {
		const a = new Set();
		const b = new Set([1, 2, 3]);
		expect(areSetsEqual(a, b)).toBe(false);
	});

	test('A=Non-Empty B=Empty should return false', () => {
		const a = new Set([1, 2, 3]);
		const b = new Set();
		expect(areSetsEqual(a, b)).toBe(false);
	});

	test('A=Non-Empty B=Non-Empty with same elements should return true', () => {
		const a = new Set([1, 2, 3]);
		const b = new Set([3, 2, 1]);
		expect(areSetsEqual(a, b)).toBe(true);
	});

	test('A=Non-Empty B=Non-Empty with different elements should return false', () => {
		const a = new Set([1, 2, 3]);
		const b = new Set([4, 5, 6]);
		expect(areSetsEqual(a, b)).toBe(false);
	});

	test('A=Non-Empty B=Non-Empty with some common elements should return false', () => {
		const a = new Set([1, 2, 3]);
		const b = new Set([2, 3, 4]);
		expect(areSetsEqual(a, b)).toBe(false);
	});

	test('A and B with same non-primitive elements should return true', () => {
		const obj1 = { id: 1 };
		const obj2 = { id: 2 };
		const a = new Set([obj1, obj2]);
		const b = new Set([obj2, obj1]);
		expect(areSetsEqual(a, b)).toBe(true);
	});
});
