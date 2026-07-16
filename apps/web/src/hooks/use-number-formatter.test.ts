import { describe, expect, test } from 'vitest';
import { useNumberFormatter } from './use-number-formatter';

describe('Hooks/UseNumberFormatter', () => {
	const fmt = useNumberFormatter();

	test('negative number', () => {
		const input = -1000;
		const expected = '-1K';
		const actual = fmt.format(input);
		expect(actual).toBe(expected);
	});

	test('zero', () => {
		const input = 0;
		const expected = '0';
		const actual = fmt.format(input);
		expect(actual).toBe(expected);
	});

	test('one', () => {
		const input = 1;
		const expected = '1';
		const actual = fmt.format(input);
		expect(actual).toBe(expected);
	});

	test('random number between 0-10', () => {
		const input = Math.floor(Math.random() * 10);
		const expected = input.toString();
		const actual = fmt.format(input);
		expect(actual).toBe(expected);
	});

	test('10', () => {
		const input = 10;
		const expected = '10';
		const actual = fmt.format(input);
		expect(actual).toBe(expected);
	});

	test('1_000', () => {
		const input = 1_000;
		const expected = '1K';
		const actual = fmt.format(input);
		expect(actual).toBe(expected);
	});

	test('10_000', () => {
		const input = 10_000;
		const expected = '10K';
		const actual = fmt.format(input);
		expect(actual).toBe(expected);
	});

	test('1_000_000', () => {
		const input = 1_000_000;
		const expected = '1M';
		const actual = fmt.format(input);
		expect(actual).toBe(expected);
	});
});
