import { describe, expect, test } from 'vitest';
import { toTitleCase } from './text';

describe('Lib/Text', () => {
	test('empty string should return empty string', () => {
		const input = '';
		const expected = '';
		const result = toTitleCase(input);
		expect(result).toBe(expected);
	});

	test('single character should return uppercase character', () => {
		const input = 'a';
		const expected = 'A';
		const result = toTitleCase(input);
		expect(result).toBe(expected);
	});

	test('first character should be uppercase', () => {
		const input = 'hello world';
		const expected = 'Hello world';
		const result = toTitleCase(input);
		expect(result).toBe(expected);
	});

	test('first character should be uppercase even if it is already uppercase', () => {
		const input = 'Hello world';
		const expected = 'Hello world';
		const result = toTitleCase(input);
		expect(result).toBe(expected);
	});
});
