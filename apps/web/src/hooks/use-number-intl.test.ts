import { describe, expect, test } from 'vitest';
import { useNumberIntl } from './use-number-intl';

describe('Hooks/UseNumberIntl', () => {
	const fmt = useNumberIntl({
		one: 'squirrel',
		other: 'squirrels',
	});

	test('zero', () => {
		const expected = '0 squirrels';
		const actual = fmt(0);
		expect(actual).toBe(expected);
	});

	test('one', () => {
		const expected = '1 squirrel';
		const actual = fmt(1);
		expect(actual).toBe(expected);
	});

	test('two', () => {
		const expected = '2 squirrels';
		const actual = fmt(2);
		expect(actual).toBe(expected);
	});

	test('arbitrarily large number', () => {
		// Keep it under 1000 to avoid compact formatting (e.g., 1.2K)
		// Number formatting is tested in use-number-formatter.test.ts
		const arbitraryNumber = Math.floor(Math.random() * 900) + 3;
		const expected = `${arbitraryNumber} squirrels`;
		const actual = fmt(arbitraryNumber);
		expect(actual).toBe(expected);
	});
});
