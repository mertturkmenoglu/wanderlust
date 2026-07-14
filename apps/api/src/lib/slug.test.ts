import { describe, expect, test } from 'vitest';
import { slugifyWithRandom } from './slug';

describe('slugify', () => {
	test('should handle empty input', () => {
		const input = '';
		const result = slugifyWithRandom(input);
		expect(result.length).toBe(4);
	});

	test('should handle lowercase 1 word input', () => {
		const input = 'squirrel';
		const result = slugifyWithRandom(input);
		expect(result.startsWith('squirrel-')).toBe(true);
		expect(result.length).toBe('squirrel-'.length + 4);
	});

	test('should handle whitespace', () => {
		const input = 'async squirrel';
		const result = slugifyWithRandom(input);
		expect(result.startsWith('async-squirrel-')).toBe(true);
		expect(result.length).toBe('async-squirrel-'.length + 4);
	});

	test('should handle multiple whitespace', () => {
		const input = ' async  squirrel ';
		const result = slugifyWithRandom(input);
		expect(result.startsWith('async-squirrel-')).toBe(true);
		expect(result.length).toBe('async-squirrel-'.length + 4);
	});

	test('should handle uppercase characters', () => {
		const input = 'AsyncSquirrel';
		const result = slugifyWithRandom(input);
		expect(result.startsWith('async-squirrel-')).toBe(true);
		expect(result.length).toBe('async-squirrel-'.length + 4);
	});
});
