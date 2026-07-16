import { describe, expect, test } from 'vitest';
import { deserializeParams, serializeParams } from './serde';

describe('Lib/Search/Serde', () => {
	describe('Serialize Params', () => {
		test('undefined params should return undefined', () => {
			const input = undefined;
			const result = serializeParams(input);
			const expected = undefined;
			expect(result).toBe(expected);
		});

		test('empty array should return empty string', () => {
			const input: string[] = [];
			const result = serializeParams(input);
			const expected = '';
			expect(result).toBe(expected);
		});

		test('array with single element should return that element', () => {
			const input = ['test'];
			const result = serializeParams(input);
			const expected = 'test';
			expect(result).toBe(expected);
		});

		test('array with multiple elements should return joined string', () => {
			const input = ['test1', 'test2', 'test3'];
			const result = serializeParams(input);
			const expected = 'test1|test2|test3';
			expect(result).toBe(expected);
		});

		test('array with spaces should replace spaces with +', () => {
			const input = ['test 1', 'test 2'];
			const result = serializeParams(input);
			const expected = 'test+1|test+2';
			expect(result).toBe(expected);
		});
	});

	describe('Deserialize Params', () => {
		test('undefined input should return undefined', () => {
			const input = undefined;
			const result = deserializeParams(input);
			const expected = undefined;
			expect(result).toBe(expected);
		});

		test('empty string should return array with 1 element which is empty string', () => {
			const input = '';
			const result = deserializeParams(input);
			const expected: string[] = [''];
			expect(result).toEqual(expected);
		});

		test('string with single element should return array with that element', () => {
			const input = 'test';
			const result = deserializeParams(input);
			const expected: string[] = ['test'];
			expect(result).toEqual(expected);
		});

		test('string with multiple elements should return array with those elements', () => {
			const input = 'test1|test2|test3';
			const result = deserializeParams(input);
			const expected: string[] = ['test1', 'test2', 'test3'];
			expect(result).toEqual(expected);
		});

		test('string with + should replace + with spaces', () => {
			const input = 'test+1|test+2';
			const result = deserializeParams(input);
			const expected: string[] = ['test 1', 'test 2'];
			expect(result).toEqual(expected);
		});
	});

	describe('Serialize and Deserialize Params', () => {
		test('serialize and then deserialize should return original array', () => {
			const input = ['test 1', 'test 2', 'test 3'];
			const serialized = serializeParams(input);
			const deserialized = deserializeParams(serialized);
			expect(deserialized).toEqual(input);
		});
	});
});
