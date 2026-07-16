import type { MultipleFieldErrors, ValidateResult } from 'react-hook-form';
import { describe, expect, test } from 'vitest';
import {
	lengthTracker,
	normalizeMultipleErrors,
	truncateWithEllipses,
} from './form';

describe('Lib/Form', () => {
	describe('Length Tracker', () => {
		test('should handle undefined string', () => {
			const max = 10;
			const input: string | undefined = undefined;
			const expected = '0/10';
			expect(lengthTracker(input, max)).toBe(expected);
		});

		test('should handle empty string', () => {
			const max = 10;
			const input = '';
			const expected = '0/10';
			expect(lengthTracker(input, max)).toBe(expected);
		});

		test('should handle string shorter than max', () => {
			const max = 10;
			const input = 'Hello';
			const expected = '5/10';
			expect(lengthTracker(input, max)).toBe(expected);
		});

		test('should handle string equal to max', () => {
			const max = 5;
			const input = 'Hello';
			const expected = '5/5';
			expect(lengthTracker(input, max)).toBe(expected);
		});

		test('should handle string longer than max', () => {
			const max = 5;
			const input = 'Hello, World!';
			const expected = '13/5';
			expect(lengthTracker(input, max)).toBe(expected);
		});

		test('should handle negative max value', () => {
			const max = -5;
			const input = 'Hello';
			expect(() => lengthTracker(input, max)).toThrow(
				'Max length cannot be negative',
			);
		});

		test('should handle max=0', () => {
			const max = 0;
			const input = 'Hello';
			const expected = '5/0';
			expect(lengthTracker(input, max)).toBe(expected);
		});
	});

	describe('Truncate With Ellipses', () => {
		test('should not truncate string shorter than max', () => {
			const max = 10;
			const input = 'Hello';
			const expected = 'Hello';
			expect(truncateWithEllipses(input, max)).toBe(expected);
		});

		test('should not truncate string equal to max', () => {
			const max = 5;
			const input = 'Hello';
			const expected = 'Hello';
			expect(truncateWithEllipses(input, max)).toBe(expected);
		});

		test('should truncate string longer than max', () => {
			const max = 5;
			const input = 'Hello, World!';
			const expected = 'Hello...';
			expect(truncateWithEllipses(input, max)).toBe(expected);
		});

		test('should handle empty string', () => {
			const max = 5;
			const input = '';
			const expected = '';
			expect(truncateWithEllipses(input, max)).toBe(expected);
		});

		test('should handle max=0', () => {
			const max = 0;
			const input = 'Hello';
			const expected = '...';
			expect(truncateWithEllipses(input, max)).toBe(expected);
		});

		test('should throw when max is negative', () => {
			const max = -5;
			const input = 'Hello';
			expect(() => truncateWithEllipses(input, max)).toThrow(
				'Max length cannot be negative',
			);
		});
	});

	describe('Normalize Multiple Errors', () => {
		test('should return empty array for undefined errors', () => {
			const errors = undefined;
			const expected: Array<{ message: string }> = [];
			expect(normalizeMultipleErrors(errors)).toEqual(expected);
		});

		test('should return empty array for empty errors object', () => {
			const errors = {};
			const expected: Array<{ message: string }> = [];
			expect(normalizeMultipleErrors(errors)).toEqual(expected);
		});

		test('should normalize string error', () => {
			const errors: MultipleFieldErrors = {
				value: 'Error message',
			};
			const expected = [{ message: 'Error message' }];
			expect(normalizeMultipleErrors(errors)).toEqual(expected);
		});

		test('should normalize array of string errors', () => {
			const errors: MultipleFieldErrors = {
				value: ['Error message 1', 'Error message 2'],
			};
			const expected = [
				{ message: 'Error message 1' },
				{ message: 'Error message 2' },
			];
			expect(normalizeMultipleErrors(errors)).toEqual(expected);
		});

		test('should ignore non-string and non-array errors', () => {
			const errors: MultipleFieldErrors = {
				value: {} as ValidateResult,
			};
			const expected: Array<{ message: string }> = [];
			expect(normalizeMultipleErrors(errors)).toEqual(expected);
		});
	});
});
